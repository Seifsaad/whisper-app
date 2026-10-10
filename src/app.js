import 'dotenv/config'
import './lib/db/mongoose.js'
import express from 'express';
import authRouter from "./app/auth/auth.route.js";
import messageRouter from "./app/message/message.route.js";
import userRouter from "./app/user/user.route.js";
import {logger} from "./pkg/logger/logger.js";

const app = express();
import cors from "cors";
import {env} from "./lib/config/env.js";
import {globalErrorHandler} from "./lib/error/error.handler.js";
import {router} from "./route.js";
import {correlationId} from "./lib/correlation/correlationId.js";


export function createApp() {
    app.use(cors({origin: 'http://localhost:4200'}));
    app.use(express.json());
    app.use(correlationId)
    app.use('/api', router);

    app.use(globalErrorHandler)


    return app
}