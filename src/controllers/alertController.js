import Alert from '../models/Alert.js';
import Device from '../models/Device.js';

// @desc    Get alerts for a device
// @route   GET /api/alerts/:deviceId
// @access  Private
const getAlerts = async (req, res) => {
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

    const alerts = await Alert.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all alerts (NURSE only)
// @route   GET /api/alerts
// @access  Private (NURSE only)
const getAllAlerts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const alerts = await Alert.find()
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getAlerts, getAllAlerts };

