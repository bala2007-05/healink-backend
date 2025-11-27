import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['NURSE', 'PATIENT'],
      required: true,
    },
    assignedDevice: {
      type: String,
      default: null,
    },
    roomNumber: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Note: Email unique index is already defined in schema above (unique: true)
// No need for duplicate index definition

// Hash password before saving
userSchema.pre('save', async function (next) {
  console.log('🔐 User pre-save hook triggered');
  console.log('   - Password modified:', this.isModified('password'));
  
  if (!this.isModified('password')) {
    console.log('   - Password not modified, skipping hash');
    return next();
  }
  
  try {
    console.log('   - Hashing password with bcryptjs (salt rounds: 10)');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('   - Password hashed successfully');
    next();
  } catch (error) {
    console.error('   - Error hashing password:', error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    console.log('🔍 Comparing passwords...');
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('   - Password match:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('   - Error comparing passwords:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

export default User;
