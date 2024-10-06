"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.getMessage = exports.getUnreadMessagesCount = exports.updateMessageReadStatus = exports.createMessage = void 0;
const message_model_1 = __importDefault(require("./message.model"));
function createMessage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = new message_model_1.default(data);
        return message.save();
    });
}
exports.createMessage = createMessage;
function updateMessageReadStatus(chatId, senderId) {
    return __awaiter(this, void 0, void 0, function* () {
        return message_model_1.default.updateMany({ chatId, senderId, isRead: false }, { $set: { isRead: true } });
    });
}
exports.updateMessageReadStatus = updateMessageReadStatus;
function getUnreadMessagesCount(chatId, senderId) {
    return __awaiter(this, void 0, void 0, function* () {
        return message_model_1.default.countDocuments({ chatId, senderId, isRead: false });
    });
}
exports.getUnreadMessagesCount = getUnreadMessagesCount;
function getMessage(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        return message_model_1.default.find({ chatId });
    });
}
exports.getMessage = getMessage;
function deleteMessage(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = yield message_model_1.default.findById(messageId);
        if (!message)
            throw new Error("Message not found!");
        return message_model_1.default.findByIdAndDelete(messageId);
        // await Message.findByIdAndUpdate(messageId, { text: "message has been removed"})
    });
}
exports.deleteMessage = deleteMessage;
