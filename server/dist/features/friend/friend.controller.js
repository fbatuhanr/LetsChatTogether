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
exports.removeUserFriend = exports.getUserFriends = void 0;
const friendService = __importStar(require("./friend.service"));
const chatService = __importStar(require("../chat/chat.service"));
function getUserFriends(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const friends = yield friendService.getUserFriends(userId);
            if (!friends)
                return res.status(404).json({ message: "Friends not found!" });
            return res.status(200).json(friends);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getUserFriends = getUserFriends;
function removeUserFriend(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, friendId } = req.params;
            const result = yield friendService.removeUserFriend(userId, friendId);
            if (!result) {
                return res.status(404).json({ message: "Friends not found!" });
            }
            const chat = yield chatService.findChat(userId, friendId);
            if (chat) {
                yield chatService.deleteChat(chat.id);
            }
            return res.status(200).json({ message: "Friend removed successfully!" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.removeUserFriend = removeUserFriend;
