import { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service'
import ms from 'ms'

async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {

    const { refreshToken } = req.cookies // Get the refresh token from the cookies
    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token not provided.' })
    }

    const newTokens = await authService.refreshToken(refreshToken)
    if (newTokens) {

      res.cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // its true when production and its false development mode
        sameSite: "none",
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION!)
      });
      return res.status(200).json({
        message: 'Token refreshed successfully!',
        accessToken: newTokens.accessToken,
      });
    } else {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }
  } catch (error) {
    next(error);
  }
}

export { refreshToken };
