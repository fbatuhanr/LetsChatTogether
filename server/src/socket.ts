import { Server } from 'socket.io';

let io: Server;
let socketUsers: string[] = []; // Kullanıcıların listesi

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  io.on('connection', (socket) => {

    const userId = socket.handshake.headers.userid as string;
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

    socket.on('disconnect', async () => {
      console.log("User disconnected", userId);
      socketUsers = socketUsers.filter(user => user !== userId);
      io.emit("users", socketUsers);
    });
  });
};

export const getIO = () => io
export const getSocketUsers = () => socketUsers
