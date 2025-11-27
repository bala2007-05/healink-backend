import Device from '../models/Device.js';
import User from '../models/User.js';
import { getMQTTClient } from '../config/mqtt.js';

// @desc    Get all devices
// @route   GET /api/devices
// @access  Private
const getDevices = async (req, res) => {
  try {
    let devices;

    // If user is PATIENT, only show their assigned device
    if (req.user.role === 'PATIENT') {
      if (!req.user.assignedDevice) {
        return res.json({
          success: true,
          count: 0,
          data: [],
        });
      }
      devices = await Device.find({ deviceId: req.user.assignedDevice }).sort({ createdAt: -1 });
    } else {
      // NURSE can see all devices
      devices = await Device.find().populate('assignedTo', 'name email').sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single device
// @route   GET /api/devices/:id
// @access  Private
const getDevice = async (req, res) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.id }).populate('assignedTo', 'name email');

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found',
      });
    }

    // If user is PATIENT, check if device is assigned to them
    if (req.user.role === 'PATIENT' && req.user.assignedDevice !== device.deviceId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this device',
      });
    }

    res.json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a new device
// @route   POST /api/devices
// @access  Private (NURSE only)
const createDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deviceId',
      });
    }

    // Check if device already exists
    const deviceExists = await Device.findOne({ deviceId: deviceId.toUpperCase() });

    if (deviceExists) {
      return res.status(400).json({
        success: false,
        message: 'Device already exists',
      });
    }

    const device = await Device.create({
      deviceId: deviceId.toUpperCase(),
      status: 'inactive',
    });

    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Assign device to patient
// @route   POST /api/devices/assign
// @access  Private (NURSE only)
const assignDevice = async (req, res) => {
  try {
    const { deviceId, patientId } = req.body;

    if (!deviceId || !patientId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deviceId and patientId',
      });
    }

    // Check if device exists
    const device = await Device.findOne({ deviceId: deviceId.toUpperCase() });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found',
      });
    }

    // Check if patient exists
    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    if (patient.role !== 'PATIENT') {
      return res.status(400).json({
        success: false,
        message: 'User is not a patient',
      });
    }

    // Assign device to patient
    device.assignedTo = patientId;
    await device.save();

    // Update patient's assignedDevice
    patient.assignedDevice = deviceId.toUpperCase();
    await patient.save();

    res.json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Send command to device
// @route   POST /api/devices/send-command
// @access  Private (NURSE only)
const sendCommand = async (req, res) => {
  try {
    const { deviceId, command } = req.body;

    if (!deviceId || !command) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deviceId and command',
      });
    }

    const mqttClient = getMQTTClient();

    if (!mqttClient) {
      return res.status(500).json({
        success: false,
        message: 'MQTT client not connected',
      });
    }

    const topic = `healink/device/${deviceId.toUpperCase()}/cmd`;
    const payload = JSON.stringify({ command, timestamp: new Date().toISOString() });

    mqttClient.publish(topic, payload, (error) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Failed to publish command',
        });
      }

      res.json({
        success: true,
        message: 'Command sent successfully',
        data: {
          deviceId: deviceId.toUpperCase(),
          command,
          topic,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getDevices, getDevice, createDevice, assignDevice, sendCommand };
