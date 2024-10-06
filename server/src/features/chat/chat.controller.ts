import { Request, Response, NextFunction } from "express";
import * as chatService from "./chat.service";
import * as messageService from "../message/message.service";
import { getIO, getSocketUsers, setSocketChatState } from "../../socket";

async function createChat(req: Request, res: Response, next: NextFunction) {
  try {
    const { senderId, receiverId } = req.body;

    const chat = await chatService.createChat(senderId, receiverId);
    setSocketChatState(senderId, chat._id.toString());

    messageService.updateMessageReadStatus(chat._id.toString(), receiverId);

    if (getSocketUsers().includes(receiverId)) {
      getIO().to(`room${receiverId}`).emit("chatSelected");
    }

    return res.json(chat);
  } catch (error) {
    next(error);
  }
}

async function findUserChats(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const chats = await chatService.findUserChats(userId);
    if (!chats) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    const chatsWithUnreadMessageCount = await Promise.all(
      chats.map(async (chat) => {
        const receiverId = chat.members.filter(memberId => memberId.toString() !== userId).toString();
        const unreadMessagesCount = await messageService.getUnreadMessagesCount(chat._id.toString(), receiverId);

        return {
          ...chat.toObject(),
          unreadMessagesCount,
        };
      })
    );

    return res.json(chatsWithUnreadMessageCount);
  } catch (error) {
    next(error);
  }
}
async function findChat(req: Request, res: Response, next: NextFunction) {
  try {
    const { senderId, receiverId } = req.params;
    const chat = await chatService.findChat(senderId, receiverId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }
    return res.json(chat);
  } catch (error) {
    next(error);
  }
}

async function deleteChat(req: Request, res: Response, next: NextFunction) {
  try {
    const { chatId } = req.params;
    const { deleteBy, receiverId } = req.body;

    await chatService.deleteChat(chatId);

    if (getSocketUsers().includes(receiverId)) {
      getIO().to(`room${receiverId}`).emit("chatDeleted", { chatId, deleteBy });
    }

    return res.json({
      message: "Chat and related messages deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export { createChat, findUserChats, findChat, deleteChat };
