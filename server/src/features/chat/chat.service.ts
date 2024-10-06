import Chat from "./chat.model";
import Message from "../message/message.model";

async function createChat(senderId: string, receiverId: string) {
  const chat = await Chat.findOne({ members: { $all: [senderId, receiverId] } });
  if (chat) {
    chat.updatedAt = new Date();
    await chat.save();
    return chat;
  }

  const newChat = new Chat({ members: [senderId, receiverId] });
  return newChat.save();
}

async function findUserChats(userId: string) {
  return Chat.find({ members: { $in: [userId] } });
}

async function findChat(senderId: string, receiverId: string) {
  return Chat.findOne({ members: { $all: [senderId, receiverId] } });
}

async function deleteChat(chatId: string) {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new Error("Chat not found!");

  await Chat.findByIdAndDelete(chatId);
  await Message.deleteMany({ chatId });
}

export { createChat, findUserChats, findChat, deleteChat };
