import * as authRepository from '../repository/auth.repository.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import * as otpRepository from '../repository/otp.repository.js'
import {sendEmail} from "../../../common/email/nodemailer.js";

export async function register(userData){
    const userExist = await authRepository.checkUserExistByEmail(userData.email)
    if(userExist) throw new Error("User already exists")
    userData.password = await bcrypt.hash(userData.password, 10)
    const createUser = await authRepository.createUser(userData)
    const otp = crypto.randomInt(100000,999999).toString()
    await otpRepository.createOTP({
        code: otp,
        email: userData.email,
        expiresAt: new Date(Date.now()+1000*60*5),
    })
    await sendEmail(userData.email,`verification code`,`<h1>Your verification code is ${otp}</h1>`)
    return createUser
}