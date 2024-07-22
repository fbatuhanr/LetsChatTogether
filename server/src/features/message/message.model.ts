import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const MessageSchema = new Schema(
    {
        chatId: String,
        senderId: String,
        text: String
    },
    {
        timestamps: true
    }
)

export default model("Message", MessageSchema);