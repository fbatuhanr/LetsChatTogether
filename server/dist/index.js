"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_1 = require("./socket"); // Ortak modül
/* Import Routes */
const user_1 = require("./features/user");
const chat_1 = require("./features/chat");
const message_1 = require("./features/message");
const friendRequest_1 = require("./features/friendRequest");
const friend_1 = require("./features/friend");
const auth_1 = require("./features/auth");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
/* CONFIGURATIONS */
dotenv_1.default.config();
mongoose_1.default
    .connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_NAME })
    .then(() => console.log("Connected to the database"))
    .catch((e) => console.log("Error connecting to database", e));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json({ limit: "100mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cookie_parser_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
const expressServer = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
(0, socket_1.initializeSocket)(expressServer);
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.use("/user", user_1.user);
app.use("/chat", chat_1.chat);
app.use("/message", message_1.message);
app.use("/friend-request", friendRequest_1.friendRequest);
app.use("/friend", friend_1.friend);
app.use('/auth', auth_1.auth);
app.use(errorHandler_1.default);
