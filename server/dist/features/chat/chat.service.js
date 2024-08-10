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
exports.deleteChat = exports.findChat = exports.findUserChats = exports.createChat = void 0;
const chat_model_1 = __importDefault(require("./chat.model"));
const message_model_1 = __importDefault(require("../message/message.model"));
function createChat(firstId, secondId) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat = yield chat_model_1.default.findOne({ members: { $all: [firstId, secondId] } });
        if (chat)
            return chat;
        const newChat = new chat_model_1.default({ members: [firstId, secondId] });
        return newChat.save();
    });
}
exports.createChat = createChat;
function findUserChats(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return chat_model_1.default.find({ members: { $in: [userId] } });
    });
}
exports.findUserChats = findUserChats;
function findChat(firstId, secondId) {
    return __awaiter(this, void 0, void 0, function* () {
        return chat_model_1.default.findOne({ members: { $all: [firstId, secondId] } });
    });
}
exports.findChat = findChat;
function deleteChat(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat = yield chat_model_1.default.findById(chatId);
        if (!chat)
            throw new Error('Chat not found!');
        yield chat_model_1.default.findByIdAndDelete(chatId);
        yield message_model_1.default.deleteMany({ chatId });
    });
}
exports.deleteChat = deleteChat;
