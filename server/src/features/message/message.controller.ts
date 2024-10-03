import { Request, Response, NextFunction } from "express"
import * as messageService from './message.service'
import { getIO } from "../../socket";

async function createMessage(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await messageService.createMessage(req.body))
    } catch (err) {
        next(err)
    }
}
async function getMessage(req: Request, res: Response, next: NextFunction) {
    try {
        const { chatId } = req.params;
        res.json(await messageService.getMessage(chatId))
    } catch (err) {
        next(err);
    }
}
async function deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
        const { messageId } = req.params
        await messageService.deleteMessage(messageId)
        
        const io = getIO()
        io.emit('messageDeleted', messageId)

        res.status(200).json({ message: 'Message deleted successfully.' })

    } catch (error) {
        next(error)
    }
}

export { createMessage, getMessage, deleteMessage }