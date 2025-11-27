import express from 'express';
import { getTelemetry, getLatestTelemetry } from '../controllers/telemetryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:deviceId', protect, getTelemetry);
router.get('/:deviceId/latest', protect, getLatestTelemetry);

export default router;
