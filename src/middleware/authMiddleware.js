import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    console.log('❌ Auth middleware: Token missing');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing',
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };
    
    console.log('✅ Token verified:', {
      id: req.user.id,
      role: req.user.role,
      email: req.user.email,
    });
    
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid',
    });
  }
};

// Export as both default and named export (protect) for compatibility
export default authMiddleware;
export { authMiddleware as protect };
