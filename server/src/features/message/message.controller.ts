import { Request, Response, NextFunction } from "express";
import * as messageService from "./message.service";
import { getIO, getSocketUsers, isSocketChatActive } from "../../socket";
import { MessageProps } from "../../types/Message.types";

async function createMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { senderId, receiverId, chatId, text } = req.body;
    const isRead = isSocketChatActive(receiverId, chatId);
    
    const createdMessage = await messageService.createMessage({
      chatId,
      senderId,
      text,
      isRead,
    });

    const { _id, createdAt } = createdMessage;
    const messageData: MessageProps = {
      _id: _id.toString(),
      text,
      date: createdAt,
      senderId,
      receiverId,
    };

    if (getSocketUsers().includes(receiverId) && isSocketChatActive(receiverId, chatId)) {
      getIO().to(`room${receiverId}`).emit("message", messageData);
    }

    const unreadMessagesCount = await messageService.getUnreadMessagesCount(chatId, senderId);
    const notificationData = {
      senderId,
      unreadMessagesCount
    }
    getIO().to(`room${receiverId}`).emit("messageNotification", notificationData);

    return res.json(messageData);
  } catch (err) {
    next(err);
  }
}
async function getMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { chatId } = req.params;
    return res.json(await messageService.getMessage(chatId));
  } catch (err) {
    next(err);
  }
}
async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { messageId } = req.params;
    const { chatId, receiverId } = req.body;

    await messageService.deleteMessage(messageId);

    if (getSocketUsers().includes(receiverId) && isSocketChatActive(receiverId, chatId)) {
      getIO().to(`room${receiverId}`).emit("messageDeleted", messageId);
    }

    return res.json({ message: "Message deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export { createMessage, getMessage, deleteMessage };
