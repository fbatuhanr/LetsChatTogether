import { Request, Response, NextFunction } from "express";

import * as chatService from "../chat/chat.service";
import * as messageService from "../message/message.service";
import * as friendRequestService from "../friendRequest/friendRequest.service";

async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    let totalUnreadMessageCount = 0;
    const chats = await chatService.findUserChats(userId);
    if (chats) {
      const unreadMessageCountsForChats = await Promise.all(
        chats.map(async (chat) => {
          const receiverId = chat.members
            .filter((memberId) => memberId.toString() !== userId)
            .toString();
          return await messageService.getUnreadMessagesCount(
            chat._id.toString(),
            receiverId
          );
        })
      );

      totalUnreadMessageCount = unreadMessageCountsForChats.reduce(
        (acc, num) => acc + num,
        0
      );
    }
    const totalIncomingRequestCount =
      await friendRequestService.getIncomingRequestCount(userId);

    return res.json({ totalUnreadMessageCount, totalIncomingRequestCount });
  } catch (err) {
    next(err);
  }
}

export { getNotifications };
