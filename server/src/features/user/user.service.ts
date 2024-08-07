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

async function getAllWithLimitation(page: number, limit: number) {

  const totalUsers = await User.countDocuments();
  const users = await User.find().skip((page - 1) * limit).limit(limit);
  if (!users) return false

  return {
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
    users
  }
}

async function get(id: string) {
  return User.findById(id)
}
async function getByUsername(username: string) {
  return User.findOne({ username })
}
async function searchUsers(searchRegex: RegExp, page: number, limit: number) {

  const findPattern = {
    $or: [
      { username: { $regex: searchRegex } },
      { name: { $regex: searchRegex } },
      { surname: { $regex: searchRegex } },
      { $expr: { $regexMatch: { input: { $concat: ["$name", " ", "$surname"] }, regex: searchRegex } } }
    ]
  }
  const totalUsers = await User.countDocuments(findPattern);
  const users = await User.find(findPattern).skip((page - 1) * limit).limit(limit);
  if (!users) return false

  return {
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
    users,
  }
}

async function login(data: UserProps) {

  const { username, password } = data

  const user = await User.findOne({ username })
  if (!user) return false
  if (!user.comparePassword(password)) return false

  const accessToken = generateAccessToken({ userId: user._id, username: user.username });
  const refreshToken = generateRefreshToken({ userId: user._id, username: user.username });
  return { accessToken, refreshToken }
}
async function logout() {
  return
}

async function signup(data: UserProps) {

  const newUser = new User(data)
  newUser.hashPassword = bcrypt.hashSync(data.password, 10)

  const savedUser = await newUser.save();
  return savedUser ? true : false
}

function update(id: string, file: any, data: UserProps) {

  let newData = {
    ...data
  }
  if (file)
    newData = { ...newData, profilePhoto: file.path }

  return User.findOneAndUpdate({ _id: id }, newData)
}

function remove(id: string) {
  return User.findByIdAndDelete(id)
}

export { getAll, getAllWithLimitation, get, getByUsername, searchUsers, login, logout, signup, update, remove }