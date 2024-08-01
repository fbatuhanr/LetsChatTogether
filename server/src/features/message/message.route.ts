import express from 'express'
import authenticateToken from '../../middleware/authMiddleware'
import * as messageController from './message.controller'

const router = express.Router()

router.post("/", authenticateToken, messageController.createMessage);
router.get("/:chatId", authenticateToken, messageController.getMessage);


export default router