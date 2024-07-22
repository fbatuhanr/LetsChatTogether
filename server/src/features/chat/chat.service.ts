import Chat from "./chat.model"

async function createChat(data: any) {

    const { firstId, secondId } = data;

    const chat = await Chat.findOne({ members: { $all: [firstId, secondId] } });
    if (chat) return chat

    const newChat = new Chat({ members: [firstId, secondId] });
    return await newChat.save();
}

async function findUserChats(userId: string) {

    return await Chat.find({ members: { $in: [userId] } })
}

async function findChat(data: any) {

    const { firstId, secondId } = data;

    return await Chat.findOne({ members: { $all: [firstId, secondId] } });
}


export { createChat, findUserChats, findChat }