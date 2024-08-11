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
exports.cancelRequest = exports.acceptRequest = exports.sendRequest = exports.getRequestStatusBetweenUsers = exports.getIncomingRequests = exports.getOutgoingRequests = void 0;
const friendRequest_model_1 = __importDefault(require("./friendRequest.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
function getOutgoingRequests(userId) {
    return friendRequest_model_1.default.find({ sender: userId, status: 'pending' }).populate('receiver', 'username');
}
exports.getOutgoingRequests = getOutgoingRequests;
function getIncomingRequests(userId) {
    return friendRequest_model_1.default.find({ receiver: userId, status: 'pending' }).populate('sender', 'username');
}
exports.getIncomingRequests = getIncomingRequests;
function acceptRequest(senderId, receiverId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield friendRequest_model_1.default.findOneAndUpdate({ $or: [{ sender: senderId, receiver: receiverId }, { sender: receiverId, receiver: senderId }] }, { status: 'accepted' });
        yield user_model_1.default.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId } });
        yield user_model_1.default.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId } });
        return true;
    });
}
exports.acceptRequest = acceptRequest;
function getRequestStatusBetweenUsers(senderId, receiverId) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield friendRequest_model_1.default.findOne({ $or: [{ sender: senderId, receiver: receiverId }, { sender: receiverId, receiver: senderId }] });
        if (request) {
            const isSender = request.sender.toString() === senderId;
            return { isSender, status: request.status };
        }
        return false;
    });
}
exports.getRequestStatusBetweenUsers = getRequestStatusBetweenUsers;
function sendRequest(senderId, receiverId) {
    return __awaiter(this, void 0, void 0, function* () {
        const friendRequest = new friendRequest_model_1.default({
            sender: senderId,
            receiver: receiverId
        });
        const savedFriendRequest = yield friendRequest.save();
        return savedFriendRequest ? true : false;
    });
}
exports.sendRequest = sendRequest;
function cancelRequest(senderId, receiverId) {
    return __awaiter(this, void 0, void 0, function* () {
        const removedFriendRequest = yield friendRequest_model_1.default.findOneAndDelete({ $or: [{ sender: senderId, receiver: receiverId, status: 'pending' }, { sender: receiverId, receiver: senderId, status: 'pending' }] });
        return removedFriendRequest ? true : false;
    });
}
exports.cancelRequest = cancelRequest;
