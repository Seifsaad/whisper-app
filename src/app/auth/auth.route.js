import {Router} from 'express';
import * as authController from './controller/auth.controller.js';
import {idempotency} from "../../lib/idempotency/idempotency.js";
import {cacheProvider} from "../../lib/cache/init.js";
import {verifyRefreshToken} from "./utils/token.js";
const authRouter = Router();

authRouter.post('/register',authController.register);
authRouter.patch('/verify-account',authController.varifyAccount)
authRouter.post('/login',authController.login);
authRouter.post('/send-otp',authController.sendOtp);
authRouter.patch('/reset-password',idempotency(),authController.resetPassword);
authRouter.post('/login-with-google',authController.loginWithGoogle);
authRouter.post('/refresh-token', authController.refreshTokenFn);
authRouter.post('/verify-to-login', authController.verifyToLogin);
authRouter.patch('/enable-2-steps-verification',authController.enable2stepVerification)
authRouter.post('/logout',async (req, res, next) => {
    try {
        const token = req.cookies.refresh_token;
        if (token) {
            try {
                const {jti} = verifyRefreshToken(token);
                await cacheProvider.del(`refreshToken:${jti}`);
            } catch {
            }
        }
        res.clearCookie('access_token', {path: '/'});
        res.clearCookie('refresh_token', {path: '/api/auth/refresh-token'});
        res.json({message: 'logged out'});
    } catch (e) {
        next(e);
    }
})

export default authRouter;