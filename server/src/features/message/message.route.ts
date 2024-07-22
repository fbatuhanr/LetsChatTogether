import express from 'express'
import * as messageController from './message.controller'

const router = express.Router()

router.post("/", messageController.createMessage);
router.get("/:chatId", messageController.getMessage);


export default router