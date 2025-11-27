import express from 'express';
import {
  registerNurse,
  registerPatient,
  login,
  me,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth working',
    timestamp: new Date().toISOString(),
  });
});

// Public routes
router.post('/register-nurse', registerNurse);
router.post('/register-patient', registerPatient);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, me);

// Example NURSE-only route (for testing)
router.get(
  '/nurse-only',
  authMiddleware,
  roleMiddleware('NURSE'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Nurse access granted',
      user: req.user,
    });
  }
);

export default router;
