import express from 'express';
import {
  registerNurse,
  registerPatient,
  login,
  me,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from '../controllers/authController.js';
import { sendOtpEmail, verifyEmailConfig } from '../utils/emailService.js';
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

// Test email configuration
router.get('/test-email', async (req, res) => {
  try {
    const config = await verifyEmailConfig();
    res.json({
      success: config.configured,
      message: config.message,
      configured: config.configured,
      details: config.details || null,
      errorCode: config.errorCode || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Test send email (for debugging)
router.post('/test-send-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }
    
    const testOtp = '123456';
    const result = await sendOtpEmail(email, testOtp);
    
    res.json({
      success: result.success,
      message: result.success 
        ? 'Test email sent successfully! Check your inbox.' 
        : result.message,
      errorCode: result.errorCode || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Public routes
router.post('/register-nurse', registerNurse);
router.post('/register-patient', registerPatient);
router.post('/login', login);

// Password reset routes (public)
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

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
