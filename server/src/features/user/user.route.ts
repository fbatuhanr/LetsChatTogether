import express from 'express';
import * as userController from './user.controller'

const router = express.Router();

router.get('/', userController.getAll);

router.get('/:id', userController.get);

router.post('/', userController.create);

router.put('/:id', userController.update);

router.delete('/:id', userController.remove);

export default router;