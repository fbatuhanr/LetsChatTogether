import mongoose, { Schema, model } from 'mongoose';

const MessageSchema = new Schema(
    {
        chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

export default model('Message', MessageSchema);