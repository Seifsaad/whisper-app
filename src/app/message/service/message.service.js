import * as userRepository from '../../user/repository/user.repository.js';
import {userNotExist} from "../../user/errors.js";
import * as messageRepository from "../repository/message.repository.js";
export async function sendMessage(content, receiver, sender) {
    const user = await userRepository.findUserById(receiver)
    if (!user) throw userNotExist
    return await messageRepository.sendMessage(content, receiver, sender);
}