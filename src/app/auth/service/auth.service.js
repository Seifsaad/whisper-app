import * as authRepository from '../repository/auth.repository.js'
import * as otpRepository from '../repository/otp.repository.js'
import * as userRepository from '../../user/repository/user.repository.js'
import {toMs, toSeconds} from "../../../pkg/utils/time.js";
import {
    invalidCode, invalidPassword, otpExpired
} from "../errors.js";
import {userAlreadyExist, userAlreadyVerified, userNotExist, userNotVerified} from "../../user/errors.js";
import {generateOtpCode} from "../../../lib/utils/otp.js";
import {generateAccessToken, generateRefreshToken, generateToken, verifyRefreshToken} from "../utils/token.js";
import {comparePassword, hashedPassword} from "../utils/hash.js";
import {verifyGoogleToken} from "../../../lib/utils/google-auth.js";
import {mailjetProvider} from "../../../lib/email/init.js";
import {cacheProvider} from "../../../lib/cache/init.js";
import {AppError} from "../../../lib/error/error.js";

async function verifyFn(email, code, fn) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) throw userNotExist
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) throw otpExpired;
    if (otp.code !== code) throw invalidCode;
    await otpRepository.deleteOTPsByEmail(email);
    const result = await fn(user);
    return result;
}

export async function register(userData) {
    const userExist = await authRepository.checkUserExistByEmail(userData.email)
    if (userExist) throw userAlreadyExist;
    userData.password = await hashedPassword(userData.password);
    const createUser = await authRepository.createUser(userData)
    console.log(createUser)
    const code = generateOtpCode()
    // await otpRepository.createOTP({
    //     code: code, email: userData.email, expiresAt: new Date(Date.now() + toMs(5, 'minutes')),
    // })
    await cacheProvider.set(`otp:${email}`,code,toSeconds(3,'minutes'))
    await mailjetProvider.sendEmail(userData.email, `verification code`, `<h1>Your verification code is ${code}</h1>`)
    return createUser
}

export async function varifyAccount(email, code) {
    const updatedUser = verifyFn(email, code,
        async function (user) {
            if (user.isVerified === true) throw new AppError('User already verified');
            const updatedUser = await userRepository.updateUserByEmail(user.email, { isVerified: true });
            return updatedUser;
        }
    );
    return updatedUser
}

export async function enable2stepVerification(email, code) {
    const updatedUser = verifyFn(email, code, async function (user) {
        const updatedUser = await userRepository.updateUserByEmail(user.email, { twoStepVerification: true });
        return updatedUser;
    });
    return updatedUser
}

export async function verifyToLogin(email, code) {

    const { accessToken, refreshToken } = verifyFn(email, code, async function (user) {
        const jti = crypto.randomUUID();
        const accessToken = generateAccessToken({ sub: user._id, name: user.name });
        const refreshToken = generateRefreshToken({ jti: jti, sub: user._id, name: user.name });
        await cacheProvider.set(`refreshToken:${jti}`, jti, toSeconds(7, 'days'));
        return { accessToken, refreshToken };
    });

    return { accessToken, refreshToken };

}

export async function login(email, password) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) throw userNotExist;
    if (!user.isVerified) throw userNotVerified;
    const match = await comparePassword(password, user['password'])
    if (!match) throw invalidPassword;

    if (user.twoStepsVerification == true) {
        const code = generateOtpCode();
        cacheProvider.set(`otp:${email}`,code,toSeconds(3,'minutes'));
        await mailjetProvider.sendEmail(email,'2 steps verification email code',`<h3>Your OTP to login is ${code}</h3>`)
        return ;
    }
    return generateToken({id: user._id, email: user.email, name: user.name})
}

export async function sendOtp(email) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) throw userNotExist;
    await otpRepository.deleteOTPsByEmail(email)
    const code = generateOtpCode()
    // await otpRepository.createOTP({
    //     code: code,
    //     email: email,
    //     expiresAt: Date.now() + toMs(3, 'minutes'),
    // })
    await cacheProvider.set(`otp:${email}`,code,toMs(3,'minutes'))
    await mailjetProvider.sendEmail(email, 'new otp', `<p>your new otp is ${code}</p>`)

}

export async function resetPassword(email, code, newPassword) {
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) throw otpExpired;
    if (otp !== code) throw invalidCode;
    const hashPassword = await hashedPassword(newPassword);
    await userRepository.updateUserByEmail(email, {password: hashPassword})
    await otpRepository.deleteOTPsByEmail(email)
}



export async function loginWithGoogle(idToken) {
    const payload = await verifyGoogleToken(idToken)
    const user = await authRepository.checkUserExistByEmail(payload.email);
    if (user){
        return generateToken({
            id: user._id,
            email: user.email,
        })
    }
    const createUser = await authRepository.createUser({
        name: payload.name,
        email: payload.email,
        provider: 'google',
        isVerified: true,
    })
    return generateToken({
        id: createUser._id,
        email: createUser.email
    })
}

export async function refreshTokenFn(token) {
    const payload = verifyRefreshToken(token);
    const tokenJti = await cacheProvider.get(`refreshToken:${payload.jti}`);// 1 - 0
    if (!tokenJti) {
        throw new AppError('used refresh token', 400);
    }
    await cacheProvider.del(`refreshToken:${payload.jti}`);
    const jti = crypto.randomUUID();
    const accessToken = generateAccessToken({ sub: payload.sub, name: payload.name });
    const refreshToken = generateRefreshToken({ sub: payload.sub, name: payload.name, jti: jti });
    await cacheProvider.set(`refreshToken:${jti}`, jti, toSeconds(7, 'days'));
    return {
        accessToken,
        refreshToken
    }
}

