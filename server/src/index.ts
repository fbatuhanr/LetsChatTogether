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
io.on('connection', (socket) => {

  console.log(socket.id)
  console.log('New user connected');

  socket.on('sendMessage', (message) => {
      io.emit('message', message); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

import { user } from "./features/user"
app.use("/user", user);
