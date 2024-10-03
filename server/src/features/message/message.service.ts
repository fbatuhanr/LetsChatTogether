import { CreateMessageProps } from "../../types/Message.types"
import Message from "./message.model"

async function createMessage(data: CreateMessageProps) {

    const { chatId, senderId, text } = data

    const message = new Message({
        chatId,
        senderId,
        text
    })
    return await message.save()
}

async function getMessage(chatId: string) {

    return await Message.find({ chatId })
}

async function deleteMessage(messageId: string) {

    const message = await Message.findById(messageId);
    if (!message) throw new Error('Message not found!')

    await Message.findByIdAndDelete(messageId)
    // await Message.findByIdAndUpdate(messageId, { text: "message has been removed"})
}

export { createMessage, getMessage, deleteMessage }