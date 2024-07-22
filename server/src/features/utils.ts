import jwt from 'jsonwebtoken'

const generateToken = (data: any) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY!, { expiresIn: '30s' })
}

export { generateToken }