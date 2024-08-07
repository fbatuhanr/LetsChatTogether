import mongoose, { Schema, model, InferSchemaType } from 'mongoose';
import bcrypt from "bcryptjs"

const UserSchema = new Schema({
    username: { type: String, unique: true, index: true, required: true, trim: true },
    email: { type: String, unique: true, index: true, required: true, trim: true },
    hashPassword: { type: String, required: true },
    name: { type: String },
    surname: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    dateOfBirth: { type: Date },
    profilePhoto: { type: String },
    about: { type: String },

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true
  }
)

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.hashPassword)
}

export declare interface IUser extends InferSchemaType<typeof UserSchema> {
  comparePassword(password: string): boolean
}

export default model<IUser>("User", UserSchema)