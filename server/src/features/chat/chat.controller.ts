import { Request, Response, NextFunction } from "express"
import * as chatService from './chat.service'
import { getIO } from "../../socket"

async function createChat(req: Request, res: Response, next: NextFunction) {
    try {
        const { firstId, secondId } = req.body
        res.json(await chatService.createChat(firstId, secondId))

    } catch (error) {
        next(error)
    }
}

async function findUserChats(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.params
        res.json(await chatService.findUserChats(userId))

    } catch (error) {
        next(error)
    }
}
async function findChat(req: Request, res: Response, next: NextFunction) {
    try {
        const { firstId, secondId } = req.params
        res.json(await chatService.findChat(firstId, secondId))

    } catch (error) {
        next(error)
    }
}

async function deleteChat(req: Request, res: Response, next: NextFunction) {
    try {
        const { chatId } = req.params
        const { deleteBy } = req.body
        
        await chatService.deleteChat(chatId)
        
        const io = getIO()
        io.emit('chatDeleted', {chatId, deleteBy})

        res.status(200).json({ message: 'Chat and related messages deleted successfully.' })

    } catch (error) {
        next(error)
    }
}

export { createChat, findUserChats, findChat, deleteChat }