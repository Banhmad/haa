import { Router } from 'express';
import { getProfile, updateProfile, deleteAccount, changePassword, uploadAvatar } from '../controllers/userController';
import { authenticate } from '../middleware/auth.middleware';
import { validateProfileUpdate } from '../middleware/validation';

const router = Router();
router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, updateProfile);
router.delete('/account', deleteAccount);
router.put('/change-password', changePassword);
router.put('/avatar', uploadAvatar);
export default router;
