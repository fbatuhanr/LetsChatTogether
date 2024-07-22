import Message from "./message.model"

async function createMessage(data: any) {

    const { chatId, senderId, text } = data

    const message = new Message({
        chatId,
        senderId,
        text
    })
    return await message.save()
}

async function getMessage(data: any) {

    const { chatId } = data

    return await Message.find({ chatId })
}

export { createMessage, getMessage }