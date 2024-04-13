// src/index.ts
import express, { Express, Request, Response } from "express"
import { Server } from "socket.io"
import path from "path"
import dotenv from "dotenv"
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import cors from "cors"

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

app.use(bodyParser.json({limit: "100mb"}))
app.use(bodyParser.urlencoded({limit:"50mb", extended: true}))

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

const expressServer = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

const io = new Server(expressServer, { cors: corsOptions });

let socketUsers: any = []

io.on('connection', (socket) => {

  console.log("socket connected for user : ",socket.handshake.headers.userid);
  socket.join(`room-${socket.handshake.headers.userid}`);
  socketUsers.push(socket.handshake.headers.userid);
  setTimeout(()=>{
    io.emit("USERS",socketUsers);
    console.log(socketUsers)
  },1000);


  socket.on("disconnect", async () => {
    console.log("user disconnected",socket.handshake.headers.userid);
    socketUsers = socketUsers.filter((user:any) => {
      return user !== socket.handshake.headers.userid
    })
    setTimeout(()=>{
      io.emit("USERS",socketUsers);
    },1000);
  });

  socket.on('sendMessage', (e) => {
    console.log("send message call")
    console.log(e)
    console.log(socketUsers)
    socket.to(`room-${e.receiver}`).emit("message", e);
    // save in db
    // addChat(e);
  });
});


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

import { user } from "./features/user"
app.use("/user", user);
