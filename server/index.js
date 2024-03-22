import express from "express";
import { Server } from "socket.io";

const port = process.env.PORT || 3001;

const app = express();

app.get("/", (req, res) => {
    res.sendFile(new URL("../client/index.html", import.meta.url).pathname);
});

const io = new Server({
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(socket.id)
});

io.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
});