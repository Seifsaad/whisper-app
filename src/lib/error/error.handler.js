import {logger} from "../../pkg/logger/logger.js";

export function globalErrorHandler(err, req, res, next){
        logger.error(err.message,{stack:err.stack,correlationId:req.correlationId});
        if(err.isOperational === true) {
            return  res.status(err.statusCode).json({
                message: err.message,
                success: false,
                stack: err.stack
            })
        }
        return res.status(500).json({
            error: 'something went wrong',
            success: false,
            message: err.message,
        })
    }
