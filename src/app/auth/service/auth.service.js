import * as authRepository from '../repository/auth.repository.js'
import * as otpRepository from '../repository/otp.repository.js'
import * as userRepository from '../../user/repository/user.repository.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import {sendEmail} from "../../../common/email/nodemailer.js";
import {toMs} from "../../../common/utils/time.js";


export async function register(userData) {
    const userExist = await authRepository.checkUserExistByEmail(userData.email)
    if (userExist) throw new Error("User already exists");
    userData.password = await bcrypt.hash(userData.password, 10);
    const createUser = await authRepository.createUser(userData)
    const otp = crypto.randomInt(100000, 999999).toString()
    await otpRepository.createOTP({
        code: otp,
        email: userData.email,
        expiresAt: new Date(Date.now() + toMs(5, 'minutes')),
    })
    await sendEmail(userData.email, `verification code`, `<h1>Your verification code is ${otp}</h1>`)
    return createUser
}

export async function varifyAccount(email, code) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) throw new Error("User does not exist");
    if (user.isVerified === true) throw new Error("you already verified");
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) throw new Error("otp expired, please resend otp");
    if (otp.code === code) throw new Error("invalid code");
    const updatedUser = await userRepository.updateUserByEmail(email, {isVerified: true})
    await otpRepository.deleteOTP(email)
    return updatedUser
}
