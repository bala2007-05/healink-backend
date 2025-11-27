import mongoose from 'mongoose';

const deviceSchema = mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Please add a device ID'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'warning', 'critical'],
      default: 'inactive',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    battery: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model('Device', deviceSchema);

export default Device;
