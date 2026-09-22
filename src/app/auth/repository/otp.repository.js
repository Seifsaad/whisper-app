import {OTP} from '../model/otp.model.js';


export async function createOTP(otpData) {
    return await OTP.create(otpData)
}
