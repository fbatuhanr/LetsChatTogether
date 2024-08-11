import { Request, Response, NextFunction } from "express"
import * as userService from './user.service'
import { CustomRequest } from "../../middleware/authMiddleware";
import ms from "ms";

async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await userService.getAll());
  } catch (error) {
    next(error);
  }
}
async function getAllWithLimitation(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await userService.getAllWithLimitation(page, limit)
    if (result)
      return res.status(200).json(result)

    res.status(500).json({ message: 'Unexpected error occurred.' });

  } catch (error) {
    next(error)
  }
}

async function get(req: CustomRequest, res: Response, next: NextFunction) {
  try {

    if (req.user.userId !== req.params.id) { // If it is successfully decoded by authMiddleware, decoded information is returned to req.user.
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(await userService.get(req.params.id));
  } catch (error) {
    next(error)
  }
}
async function getByUsername(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const username = req.query.username as string
    res.json(await userService.getByUsername(username));
  } catch (error) {
    next(error)
  }
}
async function searchUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const searchRegex = new RegExp(req.query.query as string, 'i')
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    
    const currUserId = req.query.currUserId as string
    
    const result = await userService.searchUsers(searchRegex, page, limit, currUserId)
    if (result)
      return res.status(200).json(result)

    res.status(500).json({ message: 'Unexpected error occurred.' });

  } catch (error) {
    next(error)
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result: any = await userService.login(req.body);
    if (!result)
      return res.status(404).json({ message: 'Invalid username or password!' })
    if (!result.refreshToken || !result.accessToken)
      return res.status(500).json({ message: 'Unexpected error occurred.' });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // its true when production and its false development mode
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict", // its none when we made production because its based on different domains, but in development its strict because localhost wants that
      maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION!)
    });
    return res.status(200).json({
      message: 'Login successful!',
      accessToken: result.accessToken
    })

  } catch (error) {
    next(error)
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
    const isSignedUp = await userService.signup(req.body);
    if (isSignedUp) {
      return res.status(201).json({ message: 'Signup successful!' });
    } else {
      return res.status(500).json({ message: 'Signup failed!' });
    }
  } catch (error) {
    next(error)
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    
    const updatedUser = await userService.update(req.params.id, req.file, req.body)
    if (!updatedUser) 
      return res.status(404).json({ message: 'An error occurred during the update.' })
    
    return res.status(201).json({ message: 'Successfully updated!' })

  } catch (error) {
    next(error);
  }
}
async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await userService.remove(req.params.id));
  } catch (error) {
    next(error);
  }
}

export { getAll, getAllWithLimitation, get, getByUsername, searchUsers, login, logout, signup, update, remove }