import mongoose from 'mongoose';

const telemetrySchema = mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Please add a device ID'],
      index: true,
    },
    dripRate: {
      type: Number,
      required: true,
    },
    flowStatus: {
      type: String,
      enum: ['flowing', 'stopped', 'blocked'],
      default: 'stopped',
    },
    bottleLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    alert: {
      type: String,
      default: null,
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
telemetrySchema.index({ deviceId: 1, timestamp: -1 });

const Telemetry = mongoose.model('Telemetry', telemetrySchema);

export default Telemetry;
