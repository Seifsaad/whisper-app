import {Router} from 'express';
const messageRouter = Router();
import * as messageController from "./controller/message.controller.js";
import {authGuard} from "../../lib/auth/authGuard.js";
messageRouter.post('/',messageController.sendMessage);
messageRouter.post('/public',authGuard,messageController.sendMessage);
messageRouter.get('/',authGuard,messageController.getAllMessages);


export default messageRouter;