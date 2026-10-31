import './lib/db/mongoose.js'
import express from 'express';


const app = express();
import cors from "cors";
import {globalErrorHandler} from "./lib/error/error.handler.js";
import {router} from "./route.js";
import {correlationId} from "./lib/correlation/correlationId.js";
import cookieParser from "cookie-parser";


export function createApp() {
    app.use(cors({origin: 'http://localhost:4200'}));
    app.use('/uploads',express.static('uploads'));
    app.use(cookieParser());
    app.use(express.json());
    app.use(correlationId)
    app.use('/api', router);

    app.get('/health',(req,res,next)=>{
        console.log('Server is HIT');
        res.json('OK')
    })
    app.use(globalErrorHandler)


    return app
}