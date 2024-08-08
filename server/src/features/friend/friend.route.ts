import { Router } from "express"
import authenticateToken from '../../middleware/authMiddleware'
import * as friendController from './friend.controller'

const router = Router()

router.get('/:userId', authenticateToken, friendController.getUserFriends);
router.delete('/:userId/:friendId', authenticateToken, friendController.removeUserFriend)

export default router