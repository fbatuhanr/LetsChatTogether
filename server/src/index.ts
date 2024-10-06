import express, { Express, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./socket";

/* Import Routes */
import { user } from "./features/user";
import { chat } from "./features/chat";
import { message } from "./features/message";
import { friendRequest } from "./features/friendRequest";
import { friend } from "./features/friend";
import { notification } from "./features/notification"
import { auth } from "./features/auth";
import errorHandler from "./middleware/errorHandler";

/* CONFIGURATIONS */
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI!, { dbName: process.env.MONGODB_NAME })
  .then(() => console.log("Connected to the database"))
  .catch((e) => console.log("Error connecting to database", e));

const app: Express = express();
const port = process.env.PORT || 3001;
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const expressServer = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

initializeSocket(expressServer);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/user", user);
app.use("/chat", chat);
app.use("/message", message);
app.use("/friend-request", friendRequest);
app.use("/friend", friend);
app.use("/notification", notification);
app.use("/auth", auth);
app.use(errorHandler);
