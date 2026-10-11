import * as userRepository from '../../user/repository/user.repository.js';
import {userNotExist} from "../../user/errors.js";
import * as messageRepository from "../repository/message.repository.js";
import {AppError} from "../../../lib/error/error.js";
export async function sendMessage(content, receiver, sender) {
    const user = await userRepository.findUserById(receiver)
    if (!user) throw userNotExist
    return await messageRepository.sendMessage(content, receiver, sender);
}

export async function getAllMessages(userId) {
    const messages = messageRepository.getAllMessages(userId)
    if(messages.length === 0 )throw new AppError("No messages found.",404);
    return messages;
}