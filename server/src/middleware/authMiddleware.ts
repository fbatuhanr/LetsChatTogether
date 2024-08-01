import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface CustomRequest extends Request {
  user?: any;
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]

  // console.log("active token: ", token)

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
    req.user = decoded
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired access token' })
  }
}

export default authenticateToken