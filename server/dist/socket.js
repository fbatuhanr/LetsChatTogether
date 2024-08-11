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
exports.getSocketUsers = exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
let socketUsers = [];
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.handshake.headers.userid;
        console.log("Socket connected for user: ", userId);
        if (!socketUsers.includes(userId)) {
            socketUsers.push(userId);
        }
        socket.join(`room${userId}`);
        io.emit("users", socketUsers);
        socket.on('sendMessage', (messageData) => {
            console.log(messageData);
            socket.to(`room${messageData.receiverId}`).emit('message', messageData);
        });
        socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("User disconnected", userId);
            socketUsers = socketUsers.filter(user => user !== userId);
            io.emit("users", socketUsers);
        }));
    });
};
exports.initializeSocket = initializeSocket;
const getIO = () => io;
exports.getIO = getIO;
const getSocketUsers = () => socketUsers;
exports.getSocketUsers = getSocketUsers;
