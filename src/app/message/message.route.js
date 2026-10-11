import {Router} from 'express';
const messageRouter = Router();
import * as messageController from "./controller/message.controller.js";
import {guard} from "../../lib/auth/guard.js";
messageRouter.post('/',messageController.sendMessage);
messageRouter.post('/public',guard,messageController.sendMessage);


export default messageRouter;