import mongoose, { InferSchemaType, model, Schema } from 'mongoose';

const FriendRequestSchema = new Schema({
  sender: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  {
    timestamps: true
});

type FriendRequestType = InferSchemaType<typeof FriendRequestSchema>

export default model<FriendRequestType>("FriendRequest", FriendRequestSchema)