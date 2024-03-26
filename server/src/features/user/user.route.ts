import express from 'express';
import * as userController from './user.controller'

const router = express.Router();

router.post('/login', userController.login);
router.post('/sign-up', userController.signup);

router.get('/', userController.getAll);

router.get('/:id', userController.get);

router.put('/:id', userController.update);

router.delete('/:id', userController.remove);

export default router;