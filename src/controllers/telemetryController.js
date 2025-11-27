import Telemetry from '../models/Telemetry.js';
import Device from '../models/Device.js';

// @desc    Get telemetry for a device
// @route   GET /api/telemetry/:deviceId
// @access  Private
const getTelemetry = async (req, res) => {
  try {
    const deviceId = req.params.deviceId.toUpperCase();
    const limit = parseInt(req.query.limit) || 50;

    // If user is PATIENT, check if device is assigned to them
    if (req.user.role === 'PATIENT') {
      if (req.user.assignedDevice !== deviceId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this device',
        });
      }
    }

    const telemetry = await Telemetry.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: telemetry.length,
      data: telemetry.reverse(), // Reverse to show oldest first
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get latest telemetry for a device
// @route   GET /api/telemetry/:deviceId/latest
// @access  Private
const getLatestTelemetry = async (req, res) => {
  try {
    const deviceId = req.params.deviceId.toUpperCase();

    // If user is PATIENT, check if device is assigned to them
    if (req.user.role === 'PATIENT') {
      if (req.user.assignedDevice !== deviceId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this device',
        });
      }
    }

    const telemetry = await Telemetry.findOne({ deviceId })
      .sort({ timestamp: -1 });

    if (!telemetry) {
      return res.status(404).json({
        success: false,
        message: 'No telemetry data found',
      });
    }

    res.json({
      success: true,
      data: telemetry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getTelemetry, getLatestTelemetry };
