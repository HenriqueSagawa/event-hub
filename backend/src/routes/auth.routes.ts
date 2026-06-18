import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();

router.post('/register', authRateLimiter, authController.register);
router.post('/verify', authRateLimiter, authController.verify);
router.post('/login', authRateLimiter, authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.put('/complete-profile', authMiddleware, authController.completeProfile);

export { router as authRoutes };
