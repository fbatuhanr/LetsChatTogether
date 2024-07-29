import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = 'your_access_token_secret'; // Güvenli bir yerde saklayın
const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret'; // Güvenli bir yerde saklayın

function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
}

function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
}

function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
  } catch (err) {
    return null;
  }
}

function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return null;
  }
}

export { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyAccessToken, 
  verifyRefreshToken 
};
