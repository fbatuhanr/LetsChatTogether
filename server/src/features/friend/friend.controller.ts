import { Request, Response, NextFunction } from 'express'
import * as friendService from './friend.service'

async function getUserFriends(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params
    const friends = await friendService.getUserFriends(userId)
    if (!friends)
      return res.status(404).json({ message: 'Friends not found!' })

    return res.status(200).json(friends)

  } catch (error) {
    next(error);
  }
}
async function removeUserFriend(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, friendId } = req.params
    const result = await friendService.removeUserFriend(userId as string, friendId as string)
    if (!result)
      return res.status(500).json({ message: 'Friends not found!' })

    return res.status(200).json({ message: 'Friend removed successfully!' })
    // return res.status(204).send()

  } catch (error) {
    next(error);
  }
}

export { getUserFriends, removeUserFriend }