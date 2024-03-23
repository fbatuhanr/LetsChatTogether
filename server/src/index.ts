// src/index.ts
import express, { Express, Request, Response } from "express";
import { Server } from "socket.io";
import mongoose from "mongoose"
import dotenv from "dotenv";

/* CONFIGURATIONS */
dotenv.config()
mongoose
  .connect(process.env.MONGODB_URI!, { dbName: process.env.MONGODB_NAME })
  .then(() => console.log("Connected to the database"))
  .catch((e) => console.log("Error connecting to database", e));


const app: Express = express();
const port = process.env.PORT || 3001;

const expressServer = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

const io = new Server(expressServer, {
  cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log(socket.id)
});


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
import { user } from "./features/user"
app.use("/user", user);
