import Chat from './chat.model'
import Message from '../message/message.model'

async function createChat(firstId: string, secondId: string) {

    const chat = await Chat.findOne({ members: { $all: [firstId, secondId] } });
    if (chat) return chat

    const newChat = new Chat({ members: [firstId, secondId] });
    return newChat.save();
}

async function findUserChats(userId: string) {

    return Chat.find({ members: { $in: [userId] } })
}

async function findChat(firstId: string, secondId: string) {

    return Chat.findOne({ members: { $all: [firstId, secondId] } });
}

async function deleteChat(chatId: string) {

    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error('Chat not found!')

    await Chat.findByIdAndDelete(chatId)
    await Message.deleteMany({ chatId })
}


export { createChat, findUserChats, findChat, deleteChat }