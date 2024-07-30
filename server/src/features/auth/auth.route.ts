import { Router } from 'express';
import { refreshToken } from './auth.controller';

const router = Router();

router.post('/refresh-token', refreshToken);

export default router;