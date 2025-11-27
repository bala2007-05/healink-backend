import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Helper function to build auth response
const buildAuthResponse = (user) => {
  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    assignedDevice: user.assignedDevice || null,
    roomNumber: user.roomNumber || null,
    token: generateToken(user),
  };
  console.log('✅ Auth response built:', {
    _id: response._id,
    email: response.email,
    role: response.role,
    roomNumber: response.roomNumber,
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
    const { name, email, password, assignedDevice } = req.body;

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
    console.log('   - Password will be hashed by pre-save hook');

    // Create nurse user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save hook
      role: 'NURSE',
      assignedDevice: assignedDevice || null,
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
    const { name, email, password, assignedDevice, roomNumber } = req.body;

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
    console.log('   - Password will be hashed by pre-save hook');

    // Create patient user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save hook
      role: 'PATIENT',
      assignedDevice: assignedDevice || null,
      roomNumber: roomNumber || null,
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

export { registerNurse, registerPatient, login, me };
