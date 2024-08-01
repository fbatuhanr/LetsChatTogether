import { MongooseError } from "mongoose"
import User, { IUser } from "./user.model"
import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from "../auth/auth.service"


type UserProps = {
  username: string,
  password: string,
  email: string | null,
  dateOfBirth: string | null,
  profilePhoto: string | null,
}

async function getAll() {
  return User.find()
}

async function get(id: string) {
  return User.findOne({ _id: id })
}

async function login(data: UserProps) {

  const { username, password } = data

  const result = User.findOne({ username })
    .then((user) => {
      if (user && user.comparePassword(password)) {

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        return { accessToken, refreshToken }
      }
      else {
        return false
      }
    })
    .catch((err) => {
      throw err
    })

  return result
}
async function logout(){
  return
}

async function signup(data: UserProps) {

  console.log(data)

  const newUser = new User(data)
  newUser.hashPassword = bcrypt.hashSync(data.password, 10)

  return newUser.save()
}

async function update(id: string, file: any, data: UserProps) {

  let newData = {
    ...data
  }
  if (file)
    newData = { ...newData, profilePhoto: file.path }

  return User.findOneAndUpdate({ _id: id }, newData)
}

async function remove(id: string) {
  return User.findByIdAndDelete(id)
}

export { getAll, get, login, logout, signup, update, remove }