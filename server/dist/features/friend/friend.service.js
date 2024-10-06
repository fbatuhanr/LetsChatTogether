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
exports.removeUserFriend = exports.getUserFriends = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const friendRequest_model_1 = __importDefault(require("../friendRequest/friendRequest.model"));
function getUserFriends(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.findById(userId)
            .populate("friends", "username profilePhoto")
            .select("username profilePhoto friends");
    });
}
exports.getUserFriends = getUserFriends;
function removeUserFriend(userId, friendId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield user_model_1.default.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
        yield user_model_1.default.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
        yield friendRequest_model_1.default.findOneAndDelete({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId },
            ],
        });
        return true;
    });
}
exports.removeUserFriend = removeUserFriend;
