import * as authRepository from '../repository/auth.repository.js'
import * as otpRepository from '../repository/otp.repository.js'
import * as userRepository from '../../user/repository/user.repository.js'
import {toMs, toSeconds} from "../../../pkg/utils/time.js";
import {
    invalidCode, invalidPassword, otpExpired
} from "../errors.js";
import {userAlreadyExist, userAlreadyVerified, userNotExist, userNotVerified} from "../../user/errors.js";
import {generateOtpCode} from "../../../lib/utils/otp.js";
import {generateToken} from "../utils/token.js";
import {comparePassword, hashedPassword} from "../utils/hash.js";
import {verifyGoogleToken} from "../../../lib/utils/google-auth.js";
import {mailjetProvider} from "../../../lib/email/init.js";
import {cacheProvider} from "../../../lib/cache/init.js";


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
    await cacheProvider.set(`otp:${createUser._id.toString()}`,code,toSeconds(3,'minutes'))
    await mailjetProvider.sendEmail(userData.email, `verification code`, `<h1>Your verification code is ${code}</h1>`)
    return createUser
}

export async function varifyAccount(email, code) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) throw userNotExist;
    if (user.isVerified === true) throw userAlreadyVerified;
    const otp = await cacheProvider.get(`otp:${user._id.toString()}`);
    console.log(otp)
    if (!otp) throw otpExpired;
    if (otp !== code) throw invalidCode;
    const updatedUser = await userRepository.updateUserByEmail(email, {isVerified: true})
    await cacheProvider.del(`otp:${user._id.toString()}`)
    return updatedUser
}

export async function login(email, password) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) throw userNotExist;
    if (!user.isVerified) throw userNotVerified;
    const match = await comparePassword(password, user['password'])
    if (!match) throw invalidPassword;
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
    await cacheProvider.set(`otp:${user._id.toString()}`,code,toSeconds(3,'minutes'))
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