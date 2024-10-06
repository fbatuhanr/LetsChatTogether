import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server;
let socketUsers = new Set<string>();
let socketChatStates: { [key: string]: string | null } = {};

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.headers.userid as string;
    console.log("Socket User Connect:",userId);

    socketUsers.add(userId);
    setSocketChatState(userId, null);

    socket.join(`room${userId}`);

    io.emit("users", getSocketUsers());

    socket.on("chatClosed", () => {
      clearSocketChatState(userId);
    });
    socket.on("disconnect", async () => {
      console.log("Socket User Disconnected:",userId);

      socketUsers.delete(userId);
      clearSocketChatState(userId);
      io.emit("users", getSocketUsers());
    });
  });
};

export const getIO = () => io;
export const getSocketUsers = () => Array.from(socketUsers);

export const getSocketChatStates = () => socketChatStates;
export const setSocketChatState = (userId: string, chatId: string | null) => { socketChatStates[userId] = chatId; };
export const clearSocketChatState = (userId: string) => { delete socketChatStates[userId]; };
export const clearAllSocketChatStates = () => { socketChatStates = {}; };

export const isSocketChatActive = (userId: string, chatId: string): boolean => {
  const activeChatId = getSocketChatStates()[userId];
  return activeChatId === chatId;
};