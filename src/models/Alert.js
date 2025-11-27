import mongoose from 'mongoose';

const alertSchema = mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Please add a device ID'],
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Please add an alert message'],
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
alertSchema.index({ deviceId: 1, timestamp: -1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
