import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

function generateAccessToken(userId: string | mongoose.Types.ObjectId): string {
  const id = userId instanceof mongoose.Types.ObjectId ? userId.toString() : userId;
  return jwt.sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '10s' });
}

function generateRefreshToken(userId: string | mongoose.Types.ObjectId): string {
  const id = userId instanceof mongoose.Types.ObjectId ? userId.toString() : userId;
  return jwt.sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '30s' });
}

async function refreshToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: string | mongoose.Types.ObjectId };
    console.log("refresh token decoded: ", decoded)
    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    console.log("refleshlenemedi! may be expire: ", err)
    return false;
  }
}

export { generateAccessToken, generateRefreshToken, refreshToken };
