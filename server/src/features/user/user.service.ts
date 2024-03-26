import { MongooseError } from "mongoose";
import User, { IUser } from "./user.model"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'


type UserProps = {
  username: string,
  password: string
}

async function getAll() {
  return User.find();
}

async function get(id: string) {
  return User.findOne({ _id: id });
}

async function login(data: UserProps) {

  const { username, password } = data

  const result = User.findOne({username})
  .then((user) => {

    if(user && user.comparePassword(password)){
      return { token: jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET_KEY!) }
    }
    return { message: 'Authentication failed. Invalid user or password.' }
  })
  .catch((err) => {
    throw err
  });

  return result

}

async function signup(data: UserProps) {

  const newUser = new User(data)
  newUser.hashPassword = bcrypt.hashSync(data.password, 10);

  return newUser.save();
}

async function update(id: string, data: UserProps) {
  return User.findOneAndUpdate({ _id: id }, data);
}

async function remove(id: string) {
  return User.findByIdAndDelete(id);
}

export { getAll, get, login, signup, update, remove };