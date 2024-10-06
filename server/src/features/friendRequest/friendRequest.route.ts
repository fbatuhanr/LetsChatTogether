import { Router } from "express";
import authenticateToken from "../../middleware/authMiddleware";
import * as friendRequestController from "./friendRequest.controller";

const router = Router();

router.get(
  "/status",
  authenticateToken,
  friendRequestController.getRequestStatusBetweenUsers
);

router.post("/send", authenticateToken, friendRequestController.sendRequest);

router.delete(
  "/cancel",
  authenticateToken,
  friendRequestController.cancelRequest
);

router.get(
  "/incoming/:userId",
  authenticateToken,
  friendRequestController.getIncomingRequests
);
router.get(
  "/outgoing/:userId",
  authenticateToken,
  friendRequestController.getOutgoingRequests
);

router.put("/accept", authenticateToken, friendRequestController.acceptRequest);

export default router;
