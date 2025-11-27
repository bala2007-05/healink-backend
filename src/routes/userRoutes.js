import express from 'express';
import { getMe, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.patch('/update-profile', protect, updateProfile);

export default router;

