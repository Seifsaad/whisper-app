import * as authService from '../service/auth.service.js'
import {toMs} from "../../../common/utils/time.js";
import {validateBody} from "../../../common/validation/validation.js";
import {loginDTO, registerDTO, resetPasswordDTO, sendDTO, verifyAccountDTO} from "../dto/auth.dto.js";


export async function register(req, res, next) {
    try {
        const data = validateBody(registerDTO,req.body)
        const createUser = await authService.register(data)
        res.status(201).json({message:'user created successfully.',success:true,data:createUser})
    }catch(err) {
        next(err)
    }
}

export async function varifyAccount(req, res, next) {
    try {
        const data = validateBody(verifyAccountDTO,req.body)
        const {email, code} = data
        const updatedUser = await authService.varifyAccount(email,code)
        res.json({message:'user verified successfully.',success:true,data:updatedUser})
    }catch (error){
        next(error)
    }
}

export async function login(req, res, next) {
    try {
        const data = validateBody(loginDTO,req.body)
        const {email, password} = data
        const token = await authService.login(email,password)
        res.cookie('access_token',token,{httpOnly:true,maxAge:toMs(1,'hours')
        })
        res.json({message:'user login successfully.',success:true})
    }catch (error){
        next(error)
    }
}

export async function sendOtp(req, res, next) {
    try {
        const data = validateBody(sendDTO,req.body)
        const {email}= data
       await authService.sendOtp(email);
        res.json({message:"new otp sent, please check your mail",success:true})
    }catch (error){
        next(error)
    }
}

export async function resetPassword(req, res, next) {
    try {
        const data = validateBody(resetPasswordDTO,req.body)
        const {email,code,newPassword}= data
        await authService.resetPassword(email,code,newPassword)
        res.json({message:'password reset successfully.',success:true})
    }catch (error){
        next(error)
    }
}


export async function loginWithGoogle(req,res,next){
    try {
        const token = await authService.loginWithGoogle(req.body.idToken)
        res.cookie('access_token',token,{httpOnly:true,maxAge:toMs(1,'hours')})
        res.json({message:'user login successfully.',success:true})
    }catch (error){
        next(error)
    }
}