import express from 'express';
import {
  getDevices,
  getDevice,
  createDevice,
  assignDevice,
  sendCommand,
} from '../controllers/deviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, getDevices);
router.get('/:id', protect, getDevice);
router.post('/', protect, authorize('NURSE'), createDevice);
router.post('/assign', protect, authorize('NURSE'), assignDevice);
router.post('/send-command', protect, authorize('NURSE'), sendCommand);

export default router;
