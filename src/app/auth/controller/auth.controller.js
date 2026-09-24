import * as authService from '../service/auth.service.js'


export async function register(req, res, next) {
    try {
        const createUser = await authService.register(req.body)
        res.status(201).json({message:'user created successfully.',success:true,data:createUser})
    }catch(err) {
        next(err)
    }
}

export async function varifyAccount(req, res, next) {
    try {
        const {email, code} = req.body
        const updatedUser = await authService.varifyAccount(email,code)
        res.json({message:'user verified successfully.',success:true,data:updatedUser})
    }catch (error){
        next(error)
    }
}