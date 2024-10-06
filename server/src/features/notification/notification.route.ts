import { Router } from "express";
import authenticateToken from "../../middleware/authMiddleware";
import * as notificationController from "./notification.controller";

const router = Router();

router.get("/:userId", authenticateToken, notificationController.getNotifications);

export default router;
