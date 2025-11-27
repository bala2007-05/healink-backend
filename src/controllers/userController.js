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

// @desc    Update user profile
// @route   PATCH /api/users/update-profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    console.log('📸 Profile update request received');
    console.log('   User ID:', req.user.id);
    console.log('   Request body keys:', Object.keys(req.body));
    console.log('   ProfileImage length:', req.body.profileImage ? req.body.profileImage.length : 0);
    
    const { profileImage } = req.body;

    // Find user by ID from auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update profile image if provided
    if (profileImage !== undefined) {
      // Accept any image format (JPEG, PNG, GIF, WEBP, BMP, HEIC, etc.)
      // The profileImage can be a URL or base64 data URL with any image MIME type
      if (profileImage && profileImage.trim().length > 0) {
        // Validate it's either a URL or a valid data URL
        const isUrl = profileImage.startsWith('http://') || profileImage.startsWith('https://');
        const isDataUrl = profileImage.startsWith('data:image/');
        
        if (isUrl || isDataUrl) {
          user.profileImage = profileImage;
        } else {
          // If it's not a valid format, use default
          user.profileImage = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';
        }
      } else {
        user.profileImage = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';
      }
    }

    // Save updated user
    const updatedUser = await user.save();

    // Return updated user (without password)
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    console.log('✅ Profile updated:', {
      userId: updatedUser._id,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage ? `${updatedUser.profileImage.substring(0, 50)}...` : 'Not set',
    });

    // Ensure response format is consistent
    const responseData = {
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: userResponse._id.toString(),
        name: userResponse.name || '',
        email: userResponse.email || '',
        role: userResponse.role || '',
        assignedDevice: userResponse.assignedDevice || null,
        roomNumber: userResponse.roomNumber || null,
        profileImage: userResponse.profileImage || 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff',
        createdAt: userResponse.createdAt ? userResponse.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: userResponse.updatedAt ? userResponse.updatedAt.toISOString() : new Date().toISOString(),
      },
    };

    // Ensure we send valid JSON
    try {
      res.status(200).json(responseData);
      console.log('✅ Response sent successfully');
    } catch (sendError) {
      console.error('❌ Error sending response:', sendError);
      res.status(500).json({
        success: false,
        message: 'Failed to send response',
      });
    }
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

export { getMe, updateProfile };

