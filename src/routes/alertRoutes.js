import express from 'express';
import { getAlerts, getAllAlerts } from '../controllers/alertController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('NURSE'), getAllAlerts);
router.get('/:deviceId', protect, getAlerts);

export default router;

