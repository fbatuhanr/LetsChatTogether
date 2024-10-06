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
exports.refreshToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
function generateAccessToken(user) {
    const id = user.userId instanceof mongoose_1.default.Types.ObjectId
        ? user.userId.toString()
        : user.userId;
    return jsonwebtoken_1.default.sign({ userId: id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(user) {
    const id = user.userId instanceof mongoose_1.default.Types.ObjectId
        ? user.userId.toString()
        : user.userId;
    return jsonwebtoken_1.default.sign({ userId: id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });
}
exports.generateRefreshToken = generateRefreshToken;
function refreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log("decoded: ", decoded);
            const newAccessToken = generateAccessToken({
                userId: decoded.userId,
                username: decoded.username,
            });
            const newRefreshToken = generateRefreshToken({
                userId: decoded.userId,
                username: decoded.username,
            });
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            console.log("Error! May be expired: ", error);
            return false;
        }
    });
}
exports.refreshToken = refreshToken;
