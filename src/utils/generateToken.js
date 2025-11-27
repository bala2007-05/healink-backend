import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set in environment variables');
      throw new Error('JWT_SECRET is not configured');
    }

    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    console.log('🎫 JWT Token generated');
    console.log('   - User ID:', payload.id);
    console.log('   - Role:', payload.role);
    console.log('   - Token length:', token.length);
    
    return token;
  } catch (error) {
    console.error('❌ Error generating token:', error);
    throw error;
  }
};

export default generateToken;
