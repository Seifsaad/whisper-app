import {Router} from 'express';
import * as authController from './controller/auth.controller.js';
import {idempotency} from "../../lib/idempotency/idempotency.js";
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
authRouter.post('/logout',(req,res,next)=>{
    res.clearCookie('access_token');
    res.json({message:'logged out'})
})

export default authRouter;