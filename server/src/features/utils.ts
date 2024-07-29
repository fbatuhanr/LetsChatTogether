import jwt from 'jsonwebtoken'

const generateAccessToken = (data: any) => {
    return jwt.sign(data, process.env.JWT_ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
}
const generateRefreshToken = (data: any) => {
return jwt.sign(data, process.env.JWT_REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
}

const generateToken = (data: any) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY!, { expiresIn: '30s' })
}

export { generateAccessToken, generateRefreshToken, generateToken }