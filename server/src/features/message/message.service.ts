import { CreateMessageProps } from "../../types/Message.types";
import Message from "./message.model";

async function createMessage(data: CreateMessageProps) {
  const message = new Message(data);
  return message.save();
}
async function updateMessageReadStatus(chatId: string, senderId: string) {
  return Message.updateMany(
    { chatId, senderId, isRead: false },
    { $set: { isRead: true } }
  );
}
async function getUnreadMessagesCount(chatId: string, senderId: string) {
  return Message.countDocuments({ chatId, senderId, isRead: false });
}

async function getMessage(chatId: string) {
  return Message.find({ chatId });
}

async function deleteMessage(messageId: string) {
  const message = await Message.findById(messageId);
  if (!message) throw new Error("Message not found!");

  return Message.findByIdAndDelete(messageId);
  // await Message.findByIdAndUpdate(messageId, { text: "message has been removed"})
}

export {
  createMessage,
  updateMessageReadStatus,
  getUnreadMessagesCount,
  getMessage,
  deleteMessage,
};
