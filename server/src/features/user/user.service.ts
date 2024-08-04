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
  try {
    const totalUsers = await User.countDocuments();

    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users
    }

  } catch (error) {
    console.error(error)
    return false
  }
}

async function get(id: string) {
  return User.findById(id)
}
async function getByUsername(username: string) {
  return User.findOne({ username })
}
async function searchUsers(searchRegex: RegExp, page: number, limit: number) {
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: searchRegex } },
        { name: { $regex: searchRegex } },
        { surname: { $regex: searchRegex } },
        { $expr: { $regexMatch: { input: { $concat: ["$name", " ", "$surname"] }, regex: searchRegex } } }
      ]
    })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments({
      $or: [
        { username: { $regex: searchRegex } },
        { name: { $regex: searchRegex } },
        { surname: { $regex: searchRegex } },
        { $expr: { $regexMatch: { input: { $concat: ["$name", " ", "$surname"] }, regex: searchRegex } } }
      ]
    });

    return {
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users,
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

async function login(data: UserProps) {

  const { username, password } = data

  const result = User.findOne({ username })
    .then((user) => {
      if (user && user.comparePassword(password)) {

        const accessToken = generateAccessToken({ userId: user._id, username: user.username });
        const refreshToken = generateRefreshToken({ userId: user._id, username: user.username });

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
async function logout() {
  return
}

async function signup(data: UserProps) {

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

export { getAll, getAllWithLimitation, get, getByUsername, searchUsers, login, logout, signup, update, remove }