import { Router } from 'express';
import { refreshToken } from './auth.controller';

const router = Router();

router.post('/token', refreshToken);

export default router;
