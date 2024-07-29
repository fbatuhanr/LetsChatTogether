import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

// Access Token oluşturma
function generateAccessToken(userId: string | mongoose.Types.ObjectId): string {
  const id = userId instanceof mongoose.Types.ObjectId ? userId.toString() : userId;
  return jwt.sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
}

// Refresh Token oluşturma
function generateRefreshToken(userId: string | mongoose.Types.ObjectId): string {
  const id = userId instanceof mongoose.Types.ObjectId ? userId.toString() : userId;
  return jwt.sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
}

// Token yenileme
async function refreshToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: string | mongoose.Types.ObjectId };
    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    return null;
  }
}

export { generateAccessToken, generateRefreshToken, refreshToken };
