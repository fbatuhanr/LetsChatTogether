import { Request, Response, NextFunction } from "express";
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
    res.json(await userService.login(req.body));
  } catch (err) {
    console.error(`Error while login`, err);
    next(err);
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
    res.json(await userService.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating the list`, err);
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await userService.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting the list`, err);
    next(err);
  }
}

export { getAll, get, login, signup, update, remove };