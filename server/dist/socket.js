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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSocketChatActive = exports.clearAllSocketChatStates = exports.clearSocketChatState = exports.setSocketChatState = exports.getSocketChatStates = exports.getSocketUsers = exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
let socketUsers = new Set();
let socketChatStates = {};
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        const userId = socket.handshake.headers.userid;
        console.log("Socket User Connect:", userId);
        socketUsers.add(userId);
        (0, exports.setSocketChatState)(userId, null);
        socket.join(`room${userId}`);
        io.emit("users", (0, exports.getSocketUsers)());
        socket.on("chatClosed", () => {
            (0, exports.clearSocketChatState)(userId);
        });
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Socket User Disconnected:", userId);
            socketUsers.delete(userId);
            (0, exports.clearSocketChatState)(userId);
            io.emit("users", (0, exports.getSocketUsers)());
        }));
    });
};
exports.initializeSocket = initializeSocket;
const getIO = () => io;
exports.getIO = getIO;
const getSocketUsers = () => Array.from(socketUsers);
exports.getSocketUsers = getSocketUsers;
const getSocketChatStates = () => socketChatStates;
exports.getSocketChatStates = getSocketChatStates;
const setSocketChatState = (userId, chatId) => { socketChatStates[userId] = chatId; };
exports.setSocketChatState = setSocketChatState;
const clearSocketChatState = (userId) => { delete socketChatStates[userId]; };
exports.clearSocketChatState = clearSocketChatState;
const clearAllSocketChatStates = () => { socketChatStates = {}; };
exports.clearAllSocketChatStates = clearAllSocketChatStates;
const isSocketChatActive = (userId, chatId) => {
    const activeChatId = (0, exports.getSocketChatStates)()[userId];
    return activeChatId === chatId;
};
exports.isSocketChatActive = isSocketChatActive;
