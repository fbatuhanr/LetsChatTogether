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
exports.deleteChat = exports.findChat = exports.findUserChats = exports.createChat = void 0;
const chatService = __importStar(require("./chat.service"));
const messageService = __importStar(require("../message/message.service"));
const socket_1 = require("../../socket");
function createChat(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { senderId, receiverId } = req.body;
            const chat = yield chatService.createChat(senderId, receiverId);
            (0, socket_1.setSocketChatState)(senderId, chat._id.toString());
            messageService.updateMessageReadStatus(chat._id.toString(), receiverId);
            if ((0, socket_1.getSocketUsers)().includes(receiverId)) {
                (0, socket_1.getIO)().to(`room${receiverId}`).emit("chatSelected");
            }
            return res.json(chat);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createChat = createChat;
function findUserChats(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const chats = yield chatService.findUserChats(userId);
            if (!chats) {
                return res.status(404).json({ message: "Chat not found!" });
            }
            const chatsWithUnreadMessageCount = yield Promise.all(chats.map((chat) => __awaiter(this, void 0, void 0, function* () {
                const receiverId = chat.members.filter(memberId => memberId.toString() !== userId).toString();
                const unreadMessagesCount = yield messageService.getUnreadMessagesCount(chat._id.toString(), receiverId);
                return Object.assign(Object.assign({}, chat.toObject()), { unreadMessagesCount });
            })));
            return res.json(chatsWithUnreadMessageCount);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findUserChats = findUserChats;
function findChat(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { senderId, receiverId } = req.params;
            const chat = yield chatService.findChat(senderId, receiverId);
            if (!chat) {
                return res.status(404).json({ message: "Chat not found!" });
            }
            return res.json(chat);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findChat = findChat;
function deleteChat(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { chatId } = req.params;
            const { deleteBy, receiverId } = req.body;
            yield chatService.deleteChat(chatId);
            if ((0, socket_1.getSocketUsers)().includes(receiverId)) {
                (0, socket_1.getIO)().to(`room${receiverId}`).emit("chatDeleted", { chatId, deleteBy });
            }
            return res.json({
                message: "Chat and related messages deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteChat = deleteChat;
