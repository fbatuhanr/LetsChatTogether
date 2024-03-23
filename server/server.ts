
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
register('ts-node/esm', pathToFileURL('./'))

import express, { Express, Request, Response } from "express"
import { Server, ServerOptions } from "socket.io"
import mongoose from "mongoose"
import dotenv from "dotenv"



/* CONFIGURATIONS */
dotenv.config()
mongoose
  .connect(process.env.MONGODB_URI!, { dbName: process.env.MONGODB_NAME })
  .then(() => console.log("Connected to the database"))
  .catch((e) => console.log("Error connecting to database", e));

const port = process.env.PORT || 3001;

const app: Express = express();
const expressServer = app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

app.get("/", (req: Request, res: Response) => {

    res.send({ msg: "hello world" })
});

import { user } from "./src/features/user"
app.use("/user", user);

const io = new Server(expressServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(socket.id)
});