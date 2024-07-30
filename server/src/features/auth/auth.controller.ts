import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies; // Refresh token'ı çerezden al
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided.' });
    }

    const newTokens = await authService.refreshToken(refreshToken);
    if (newTokens) {
      res.cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
