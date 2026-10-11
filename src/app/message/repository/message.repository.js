import {Message} from "../model/message.model.js";

export async function sendMessage(content, receiver, sender) {
    return Message.create({
        content: content,
        receiver: receiver,
        sender: sender,
    })
}

export async function getAllMessages(userId) {
    return Message.find({
            receiver: userId
        },
        {},
        {populate:{path: 'sender'}}
    )
}