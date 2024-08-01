import express from 'express'
import authenticateToken from '../../middleware/authMiddleware'
import * as chatController from './chat.controller'

const router = express.Router()

router.post("/", authenticateToken, chatController.createChat);
router.get("/:userId", authenticateToken, chatController.findUserChats);
router.get("/find/:firstId/:secondId", authenticateToken, chatController.findChat);


export default router