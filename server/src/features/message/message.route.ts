import { Router } from "express";
import authenticateToken from "../../middleware/authMiddleware";
import * as messageController from "./message.controller";

const router = Router();

router.post("/", authenticateToken, messageController.createMessage);
router.get("/:chatId", authenticateToken, messageController.getMessage);

router.delete(
  "/:messageId",
  authenticateToken,
  messageController.deleteMessage
);

export default router;
