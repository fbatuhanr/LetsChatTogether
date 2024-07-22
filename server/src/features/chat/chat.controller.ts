import { Request, Response, NextFunction } from "express"
import * as chatService from './chat.service'

async function createChat(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await chatService.createChat(req.body));
    } catch (err) {
        console.error(`Error while creating chat`, err);
        next(err);
    }
}

async function findUserChats(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await chatService.findUserChats(req.params.userId));
    } catch (err) {
        console.error(`Error while find user chats`, err);
        next(err);
    }
}
async function findChat(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.params)
        res.json(await chatService.findChat(req.params));
    } catch (err) {
        console.error(`Error while find chat`, err);
        next(err);
    }
}

export { createChat, findUserChats, findChat }