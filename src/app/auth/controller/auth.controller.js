import * as authService from '../service/auth.service.js'
import {toMs} from "../../../pkg/utils/time.js";
import {validateBody} from "../../../lib/validation/validation.js";
import {loginDTO, registerDTO, resetPasswordDTO, sendDTO, verifyAccountDTO} from "../dto/auth.dto.js";
import {setCookies} from "../utils/token.js";
import {AppError} from "../../../lib/error/error.js";


export async function register(req, res, next) {
    try {
        const data = validateBody(registerDTO, req.body)
        const createUser = await authService.register(data)
        res.status(201).json({message: 'user created successfully.', success: true, data: createUser})
    } catch (err) {
        next(err)
    }
}

export async function varifyAccount(req, res, next) {
    try {
        const data = validateBody(verifyAccountDTO, req.body)
        const {email, code} = data
        const updatedUser = await authService.varifyAccount(email, code)
        res.json({message: 'user verified successfully.', success: true, data: updatedUser})
    } catch (error) {
        next(error)
    }
}

export async function login(req, res, next) {
    try {
        const data = validateBody(loginDTO, req.body)
        const {email, password} = data
        const tokens = await authService.login(email, password)
        if (!tokens) {
            return res.json({message: "check your inbox,we sent otp", success: true})
        }
        setCookies(res, tokens.accessToken, tokens.refreshToken)
        res.json({message: 'user login successfully.', success: true})
    } catch (error) {
        next(error)
    }
}

export async function refreshTokenFn(req, res, next) {
    try {
        const token = req.cookies.refresh_token;
        if (!token) throw new AppError('No refresh token', 401);
        const {accessToken, refreshToken} = await authService.refreshTokenFn(token);
        setCookies(res, accessToken, refreshToken);
        res.json({
            message: "refresh successfully"
        });
    } catch (error) {
        next(error)
    }
}

export async function sendOtp(req, res, next) {
    try {
        const data = validateBody(sendDTO, req.body)
        const {email} = data
        await authService.sendOtp(email);
        res.json({message: "new otp sent, please check your mail", success: true})
    } catch (error) {
        next(error)
    }
}

export async function enable2stepVerification(req, res, next) {
    try {
        const {email, code} = req.body;
        await authService.enable2stepVerification(email, code)
        res.json({message: 'enable 2 steps verification successfully', success: true})
    } catch (error) {
        next(error)
    }
}

export async function resetPassword(req, res, next) {
    try {
        const data = validateBody(resetPasswordDTO, req.body)
        const {email, code, newPassword} = data
        await authService.resetPassword(email, code, newPassword)
        res.json({message: 'password reset successfully.', success: true})
    } catch (error) {
        next(error)
    }
}


export async function loginWithGoogle(req, res, next) {
    try {
        const token = await authService.loginWithGoogle(req.body.idToken)
        res.cookie('access_token', token, {httpOnly: true, maxAge: toMs(1, 'hours')})
        res.json({message: 'user login successfully.', success: true})
    } catch (error) {
        next(error)
    }
}

export async function verifyToLogin(req, res, next) {
    try {
        const {email, code} = req.body;
        const {accessToken, refreshToken} = await authService.verifyToLogin(email, code);
        setCookies(res, accessToken, refreshToken);
        res.json({message: "login successfully", success: true});
    } catch (error) {
        next(error);
    }
}