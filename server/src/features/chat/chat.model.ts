import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const ChatSchema = new Schema(
    {
        members: Array
    },
    {
        timestamps: true
    }
)

export default model("Chat", ChatSchema);