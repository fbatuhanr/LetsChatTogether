import express from 'express'
import * as chatController from './chat.controller'

const router = express.Router()

router.post("/", chatController.createChat);
router.get("/:userId", chatController.findUserChats);
router.get("/find/:firstId/:secondId", chatController.findChat);


export default router