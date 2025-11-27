import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendOtpEmail } from '../utils/emailService.js';

// Helper function to build auth response
const buildAuthResponse = (user) => {
  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    assignedDevice: user.assignedDevice || null,
    roomNumber: user.roomNumber || null,
    profileImage: user.profileImage || 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff',
    token: generateToken(user),
  };
  console.log('✅ Auth response built:', {
    _id: response._id,
    email: response.email,
    role: response.role,
    roomNumber: response.roomNumber,
    profileImage: response.profileImage,
    tokenLength: response.token.length,
  });
  return response;
};

// @desc    Register a new nurse
// @route   POST /api/auth/register-nurse
// @access  Public
const registerNurse = async (req, res) => {
  console.log('\n📝 ===== NURSE REGISTRATION STARTED =====');
  console.log('Request body:', { ...req.body, password: '***' });
  
  try {
    const { name, email, password, assignedDevice, profileImage } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    console.log('🔍 Checking if user exists...');
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    console.log('✅ No existing user found');
    console.log('📦 Creating new nurse user...');
    console.log('   - Name:', name);
    console.log('   - Email:', email);
    console.log('   - Role: NURSE');
    console.log('   - Profile Image:', profileImage || 'Using default');
    console.log('   - Password will be hashed by pre-save hook');

    // Create nurse user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save hook
      role: 'NURSE',
      assignedDevice: assignedDevice || null,
      profileImage: profileImage || undefined, // Use default if not provided
    });

    console.log('✅ User created successfully in MongoDB');
    console.log('   - User ID:', user._id);
    console.log('   - Email:', user.email);
    console.log('   - Role:', user.role);
    console.log('   - Password hashed:', user.password ? 'Yes' : 'No');

    // Verify user was saved
    const savedUser = await User.findById(user._id);
    if (!savedUser) {
      console.error('❌ CRITICAL: User not found after creation!');
      return res.status(500).json({
        success: false,
        message: 'User creation failed',
      });
    }

    console.log('✅ User verified in database');
    const authResponse = buildAuthResponse(user);

    console.log('📤 Sending response to client');
    res.status(201).json({
      success: true,
      data: authResponse,
    });
    console.log('✅ ===== NURSE REGISTRATION COMPLETED =====\n');
  } catch (error) {
    console.error('❌ ===== NURSE REGISTRATION ERROR =====');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      console.error('Duplicate email detected');
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log('❌ ===== NURSE REGISTRATION FAILED =====\n');
  }
};

// @desc    Register a new patient
// @route   POST /api/auth/register-patient
// @access  Public
const registerPatient = async (req, res) => {
  console.log('\n📝 ===== PATIENT REGISTRATION STARTED =====');
  console.log('Request body:', { ...req.body, password: '***' });
  
  try {
    const { name, email, password, assignedDevice, roomNumber, profileImage } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    console.log('🔍 Checking if user exists...');
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    console.log('✅ No existing user found');
    console.log('📦 Creating new patient user...');
    console.log('   - Name:', name);
    console.log('   - Email:', email);
    console.log('   - Role: PATIENT');
    console.log('   - Room Number:', roomNumber || 'Not provided');
    console.log('   - Profile Image:', profileImage || 'Using default');
    console.log('   - Password will be hashed by pre-save hook');

    // Create patient user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save hook
      role: 'PATIENT',
      assignedDevice: assignedDevice || null,
      roomNumber: roomNumber || null,
      profileImage: profileImage || undefined, // Use default if not provided
    });

    console.log('✅ User created successfully in MongoDB');
    console.log('   - User ID:', user._id);
    console.log('   - Email:', user.email);
    console.log('   - Role:', user.role);
    console.log('   - Password hashed:', user.password ? 'Yes' : 'No');

    // Verify user was saved
    const savedUser = await User.findById(user._id);
    if (!savedUser) {
      console.error('❌ CRITICAL: User not found after creation!');
      return res.status(500).json({
        success: false,
        message: 'User creation failed',
      });
    }

    console.log('✅ User verified in database');
    const authResponse = buildAuthResponse(user);

    console.log('📤 Sending response to client');
    res.status(201).json({
      success: true,
      data: authResponse,
    });
    console.log('✅ ===== PATIENT REGISTRATION COMPLETED =====\n');
  } catch (error) {
    console.error('❌ ===== PATIENT REGISTRATION ERROR =====');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      console.error('Duplicate email detected');
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log('❌ ===== PATIENT REGISTRATION FAILED =====\n');
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  console.log('\n🔐 ===== LOGIN STARTED =====');
  console.log('Request body:', { email: req.body.email, password: '***' });
  
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Validation failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    console.log('🔍 Searching for user with email:', email);
    
    // Check for user email and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log('✅ User found in database');
    console.log('   - User ID:', user._id);
    console.log('   - Email:', user.email);
    console.log('   - Role:', user.role);
    console.log('   - Has password field:', !!user.password);
    console.log('   - Password hash length:', user.password ? user.password.length : 0);

    console.log('🔍 Comparing passwords...');
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log('✅ Password matches!');
    const authResponse = buildAuthResponse(user);

    console.log('📤 Sending response to client');
    res.json({
      success: true,
      data: authResponse,
    });
    console.log('✅ ===== LOGIN COMPLETED =====\n');
  } catch (error) {
    console.error('❌ ===== LOGIN ERROR =====');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log('❌ ===== LOGIN FAILED =====\n');
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const me = async (req, res) => {
  try {
    console.log('\n👤 ===== GET CURRENT USER =====');
    console.log('User ID from token:', req.user.id);
    
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ User found:', user.email);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('❌ Error getting user:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Request OTP for password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save OTP to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log('✅ OTP generated for password reset:', {
      email: user.email,
      otp: otp,
      expiresAt: otpExpires,
    });

    // Send OTP via email
    console.log('📧 Sending OTP email to:', user.email);
    console.log('📧 Email credentials check:');
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set (' + process.env.EMAIL_USER + ')' : '❌ Missing'}`);
    console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Set (hidden)' : '❌ Missing'}`);
    
    const emailResult = await sendOtpEmail(user.email, otp);
    
    if (!emailResult.success) {
      console.error('❌ Email sending failed:', emailResult.message);
      console.error('   Error code:', emailResult.errorCode);
      
      // Show OTP in console for debugging
      console.log('\n' + '='.repeat(60));
      console.log('⚠️  EMAIL SENDING FAILED - OTP DISPLAYED FOR DEBUGGING');
      console.log('='.repeat(60));
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔐 OTP Code: ${otp}`);
      console.log(`⏰ Expires: ${otpExpires}`);
      console.log('='.repeat(60));
      console.log('📝 To fix: Check backend console for email error details');
      console.log('='.repeat(60) + '\n');
      
      // Return error - email was not sent
      return res.status(500).json({
        success: false,
        message: `Failed to send OTP email: ${emailResult.message}`,
        emailSent: false,
        errorCode: emailResult.errorCode,
        errorDetails: emailResult.message,
        hint: 'Please check backend email configuration. OTP is shown in backend console for debugging.',
        // Include OTP for debugging only (remove in production)
        debugOtp: otp,
      });
    }

    // Return success - OTP sent via email
    console.log('✅ Password reset OTP sent successfully to:', user.email);
    console.log('   Message ID:', emailResult.messageId);
    res.status(200).json({
      success: true,
      message: 'OTP has been sent to your email address. Please check your inbox (and spam folder).',
      emailSent: true,
      expiresIn: '10 minutes',
    });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate OTP',
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new OTP',
      });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpires) {
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP',
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again',
      });
    }

    console.log('✅ OTP verified successfully:', {
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify OTP',
    });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP, and new password',
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify OTP
    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new OTP',
      });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpires) {
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP',
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again',
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    console.log('✅ Password reset successfully:', {
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please login with your new password',
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset password',
    });
  }
};

export { registerNurse, registerPatient, login, me, forgotPassword, verifyOtp, resetPassword };
