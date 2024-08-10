"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    chatId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Message', MessageSchema);
