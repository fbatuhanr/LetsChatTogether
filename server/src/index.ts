// Import Server Requiremets
import express, { Express, Request, Response } from "express"
import { Server } from "socket.io"
import path from "path"
import dotenv from "dotenv"
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import cors from "cors"

/* Import Routes */
import { user } from "./features/user"
import { chat } from "./features/chat"
import { message } from "./features/message"
import { auth } from './features/auth';
import { errorHandler } from "./middleware/errorHandler"

/* CONFIGURATIONS */
dotenv.config()
mongoose
  .connect(process.env.MONGODB_URI!, { dbName: process.env.MONGODB_NAME })
  .then(() => console.log("Connected to the database"))
  .catch((e) => console.log("Error connecting to database", e));


const app: Express = express();

const port = process.env.PORT || 3001;
const corsOptions = {
  origin: "http://localhost:5173"
}

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "100mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

const expressServer = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

const io = new Server(expressServer, { cors: corsOptions });
let socketUsers: any = []
io.on('connection', (socket) => {

  const userId = socket.handshake.headers.userid
  console.log("socket connected for user : ", userId);

  if (!socketUsers.includes(userId))
    socketUsers.push(userId);

  socket.join(`room${userId}`);

  io.emit("users", socketUsers);

  socket.on('sendMessage', (messageData) => {
    console.log(messageData)
    socket.to(`room${messageData.receiverId}`).emit('message', messageData)
  });

  socket.on('disconnect', async () => {
    console.log("user disconnected", userId);
    socketUsers = socketUsers.filter((user: any) => user !== userId)
    io.emit("users", socketUsers);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/user", user);
app.use("/chat", chat)
app.use("/message", message)

app.use('/auth', auth);

app.use(errorHandler);