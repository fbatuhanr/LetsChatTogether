import { NextFunction, Request, Response } from 'express';
import * as friendRequestService from './friendRequest.service'

async function getAllRequestsForUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params
    const allRequests = await friendRequestService.getAllRequestsForUser(userId)
    if (!allRequests)
      return res.status(404).json({ message: 'Friend requests not found!' })

    return res.status(200).json(allRequests)

  } catch (error) {
    next(error)
  }
}

async function getRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { senderId, receiverId } = req.query

    const requestStatus = await friendRequestService.getRequest(senderId as string, receiverId as string)
    if (!requestStatus)
      return res.status(404).json({ message: 'Friend request not found!' })

    return res.status(200).json(requestStatus)

  } catch (error) {
    next(error)
  }
}

async function sendRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { senderId, receiverId } = req.body
    const friendRequest = await friendRequestService.sendRequest(senderId, receiverId)

    if (friendRequest) {
      return res.status(201).json({ message: 'Request sent successfully!' })
    } else {
      return res.status(500).json({ message: 'Request failed!' })
    }

  } catch (error) {
    next(error)
  }
}

async function acceptRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestId } = req.params
    const friendRequest = await friendRequestService.acceptRequest(requestId)

    if (friendRequest) {
      return res.status(200).json({ message: 'Request accepted!' })
    } else {
      return res.status(404).json({ message: 'Request accept failed!' })
    }

  } catch (error) {
    next(error)
  }
}

async function cancelRequest(req: Request, res: Response, next: NextFunction) {

  try {
    const { senderId, receiverId } = req.body;

    const request = await friendRequestService.cancelRequest(senderId, receiverId)
    if (!request)
      return res.status(404).json({ message: 'Friend request not found or already processed!' });

    res.status(200).json({ message: 'Request canceled successfully!' });

  } catch (error) {
    next(error)
  }
}

export { getAllRequestsForUser, getRequest, sendRequest, acceptRequest, cancelRequest }