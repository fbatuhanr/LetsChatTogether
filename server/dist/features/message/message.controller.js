"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.getMessage = exports.createMessage = void 0;
const messageService = __importStar(require("./message.service"));
const socket_1 = require("../../socket");
function createMessage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { senderId, receiverId, chatId, text } = req.body;
            const isRead = (0, socket_1.isSocketChatActive)(receiverId, chatId);
            const createdMessage = yield messageService.createMessage({
                chatId,
                senderId,
                text,
                isRead,
            });
            const { _id, createdAt } = createdMessage;
            const messageData = {
                _id: _id.toString(),
                text,
                date: createdAt,
                senderId,
                receiverId,
            };
            if ((0, socket_1.getSocketUsers)().includes(receiverId) && (0, socket_1.isSocketChatActive)(receiverId, chatId)) {
                (0, socket_1.getIO)().to(`room${receiverId}`).emit("message", messageData);
            }
            const unreadMessagesCount = yield messageService.getUnreadMessagesCount(chatId, senderId);
            const notificationData = {
                senderId,
                unreadMessagesCount
            };
            (0, socket_1.getIO)().to(`room${receiverId}`).emit("messageNotification", notificationData);
            return res.json(messageData);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.createMessage = createMessage;
function getMessage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { chatId } = req.params;
            return res.json(yield messageService.getMessage(chatId));
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getMessage = getMessage;
function deleteMessage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { messageId } = req.params;
            const { chatId, receiverId } = req.body;
            yield messageService.deleteMessage(messageId);
            if ((0, socket_1.getSocketUsers)().includes(receiverId) && (0, socket_1.isSocketChatActive)(receiverId, chatId)) {
                (0, socket_1.getIO)().to(`room${receiverId}`).emit("messageDeleted", messageId);
            }
            return res.json({ message: "Message deleted successfully." });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteMessage = deleteMessage;
