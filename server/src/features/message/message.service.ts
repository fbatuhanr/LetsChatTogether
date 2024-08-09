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

async function deleteMessage(messageId: string) {

    const message = await Message.findById(messageId);
    if (!message) throw new Error('Message not found!')

    await Message.findByIdAndDelete(messageId)
    // await Message.findByIdAndUpdate(messageId, { text: "message has been removed"})
}

export { createMessage, getMessage, deleteMessage }