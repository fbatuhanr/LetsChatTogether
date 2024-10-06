import mongoose, { Schema, model } from "mongoose";

const ChatSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  {
    timestamps: true,
  }
);

export default model("Chat", ChatSchema);
