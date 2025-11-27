import User from '../models/User.js';

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // Use req.user.id (set by authMiddleware) not req.user._id
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getMe };

