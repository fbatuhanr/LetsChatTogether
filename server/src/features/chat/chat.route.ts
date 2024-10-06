import { Router } from "express";
import authenticateToken from "../../middleware/authMiddleware";
import * as chatController from "./chat.controller";

const router = Router();

router.post("/", authenticateToken, chatController.createChat);
router.get("/:userId", authenticateToken, chatController.findUserChats);
router.get("/find/:senderId/:receiverId", authenticateToken, chatController.findChat);

router.delete("/:chatId", authenticateToken, chatController.deleteChat);

export default router;
