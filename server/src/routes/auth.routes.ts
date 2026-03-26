import { Router } from 'express';
import { register, login, getProfile, logout, refreshToken, forgotPassword, resetPassword, verifyEmail } from '../controllers/authController';
import { authenticate } from '../middleware/auth.middleware';
import { validateRegister, validateLogin, validatePasswordReset } from '../middleware/validation';

const router = Router();
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', validatePasswordReset, resetPassword);
router.get('/verify-email', verifyEmail);
export default router;
