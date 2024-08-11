"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    members: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
    ]
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Chat', ChatSchema);
