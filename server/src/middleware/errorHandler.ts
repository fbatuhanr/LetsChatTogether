import { Request, Response, NextFunction } from 'express'
import { MongoError } from 'mongodb'
import { Error as MongooseError } from 'mongoose'

type CustomError = MongoError | MongooseError.ValidationError | MongooseError.CastError | Error;


function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack)
  
  // Duplicate key error
  if (err instanceof MongoError && err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key error: A record with this information already exists.' });
  }

  // Mongoose validation error
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((error: any) => error.message);
    return res.status(400).json({ message: `Validation Error: ${messages.join(', ')}` });
  }

  // Mongoose cast error
  if (err instanceof MongooseError.CastError) {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}.` });
  }

  // General server error
  res.status(500).json({ message: `(*) ${err.message}` || '(*) Internal Server Error' });
}

export default errorHandler