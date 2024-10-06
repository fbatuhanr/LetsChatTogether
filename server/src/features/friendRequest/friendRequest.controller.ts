import { NextFunction, Request, Response } from "express";
import * as friendRequestService from "./friendRequest.service";

async function getIncomingRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const allRequests = await friendRequestService.getIncomingRequests(userId);
    if (!allRequests)
      return res
        .status(404)
        .json({ message: "Incoming friend requests not found!" });

    return res.status(200).json(allRequests);
  } catch (error) {
    next(error);
  }
}
async function getOutgoingRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const allRequests = await friendRequestService.getOutgoingRequests(userId);
    if (!allRequests)
      return res
        .status(404)
        .json({ message: "Outgoing friend requests not found!" });

    return res.status(200).json(allRequests);
  } catch (error) {
    next(error);
  }
}
async function acceptRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { senderId, receiverId } = req.body;
    const result = await friendRequestService.acceptRequest(
      senderId,
      receiverId
    );
    if (!result)
      return res.status(404).json({ message: "Friend request accept failed!" });

    return res.status(201).json({ message: "Friend request accepted!" });
  } catch (error) {
    next(error);
  }
}
async function cancelRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { senderId, receiverId } = req.body;
    const request = await friendRequestService.cancelRequest(
      senderId,
      receiverId
    );
    if (!request)
      return res
        .status(404)
        .json({ message: "Friend request not found or already processed!" });

    res.status(200).json({ message: "Friend request canceled successfully!" });
  } catch (error) {
    next(error);
  }
}

async function getRequestStatusBetweenUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { senderId, receiverId } = req.query;

    const request = await friendRequestService.getRequestStatusBetweenUsers(
      senderId as string,
      receiverId as string
    );
    if (!request)
      return res.status(404).json({ message: "Friend request not found!" });

    return res.status(200).json(request);
  } catch (error) {
    next(error);
  }
}
async function sendRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { senderId, receiverId } = req.body;
    const friendRequest = await friendRequestService.sendRequest(
      senderId,
      receiverId
    );

    if (friendRequest) {
      return res
        .status(201)
        .json({ message: "Friend request sent successfully!" });
    } else {
      return res.status(500).json({ message: "Friend request failed!" });
    }
  } catch (error) {
    next(error);
  }
}

export {
  getOutgoingRequests,
  getIncomingRequests,
  getRequestStatusBetweenUsers,
  sendRequest,
  acceptRequest,
  cancelRequest,
};
