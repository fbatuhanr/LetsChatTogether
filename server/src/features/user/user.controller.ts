import { Request, Response, NextFunction } from "express"
import * as userService from './user.service'

async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await userService.getAll());
  } catch (err) {
    console.error(`Error while getting the lists`, err);
    next(err);
  }
}

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await userService.get(req.params.id));
  } catch (err) {
    console.error(`Error while getting the list`, err);
    next(err);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result: any = await userService.login(req.body);
    if (!result)
      return res.status(404).json({ message: 'Authentication failed. Invalid user or password.' })

    if (result.refreshToken && result.accessToken) {

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      return res.status(200).json({
        message: 'Login successful!!!',
        accessToken: result.accessToken
      })
    }

    res.status(500).json({ message: 'Unexpected error occurred.' });

  } catch (err) {
    console.error(`Error while login`, err);
    next(err);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.logout(); // Logout işlemi için service fonksiyonunu çağır
    res.clearCookie('refreshToken'); // Refresh token çerezini temizle
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await userService.signup(req.body));
  } catch (err) {
    console.error(`Error while creating the list`, err);
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await userService.update(req.params.id, req.file, req.body));
  } catch (err) {
    console.error(`Error while updating the list`, err);
    next(err);
  }
}
// https://medium.com/@mohsinogen/simplified-guide-to-setting-up-a-global-error-handler-in-express-js-daf8dd640b69

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await userService.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting the list`, err);
    next(err);
  }
}

export { getAll, get, login, logout, signup, update, remove }