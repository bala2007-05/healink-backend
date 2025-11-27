// Load environment variables FIRST (before any other imports that use process.env)
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { connectMQTT, getMQTTClient } from './config/mqtt.js';
import { initializeSocketIO, getIO } from './config/socket.js';
import Device from './models/Device.js';
import Telemetry from './models/Telemetry.js';
import Alert from './models/Alert.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import alertRoutes from './routes/alertRoutes.js';

// Initialize Express
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocketIO(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'HEALINK Backend is running',
    timestamp: new Date().toISOString(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Connect to MQTT
const mqttClient = connectMQTT();

// Handle MQTT messages
mqttClient.on('message', async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    console.log(`Received MQTT message on ${topic}:`, payload);

    // Extract deviceId from topic: healink/device/<deviceId>/telemetry
    const topicParts = topic.split('/');
    const deviceId = topicParts[2]?.toUpperCase();

    if (!deviceId) {
      console.error('Invalid topic format:', topic);
      return;
    }

    if (topic.includes('/telemetry')) {
      // Handle telemetry data
      const { dripRate, flowStatus, bottleLevel, alert, timestamp } = payload;

      if (dripRate === undefined || flowStatus === undefined || bottleLevel === undefined) {
        console.error('Invalid telemetry payload:', payload);
        return;
      }

      // Auto-create device if not exists
      let device = await Device.findOne({ deviceId });
      if (!device) {
        device = await Device.create({
          deviceId,
          status: 'active',
          lastSeen: new Date(),
        });
        console.log(`Auto-created device: ${deviceId}`);
      } else {
        // Update device status
        device.status = 'active';
        device.lastSeen = new Date();
        await device.save();
      }

      // Store telemetry
      const telemetry = await Telemetry.create({
        deviceId,
        dripRate,
        flowStatus,
        bottleLevel,
        alert: alert || null,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      });

      // Emit via Socket.IO
      const ioInstance = getIO();
      if (ioInstance) {
        ioInstance.emit('device:update', {
          deviceId,
          device: device.toObject(),
          telemetry: telemetry.toObject(),
          timestamp: new Date(),
        });

        ioInstance.emit('telemetry:update', {
          deviceId,
          telemetry: telemetry.toObject(),
          timestamp: new Date(),
        });
      }

      console.log(`Telemetry stored and broadcasted for device: ${deviceId}`);

      // Create alert if alert field is present
      if (alert) {
        const alertDoc = await Alert.create({
          deviceId,
          message: alert,
          severity: 'medium',
          timestamp: new Date(),
        });

        // Emit alert via Socket.IO
        if (ioInstance) {
          ioInstance.emit('alert:new', {
            alert: alertDoc.toObject(),
            timestamp: new Date(),
          });
        }

        console.log(`Alert created for device: ${deviceId}`);
      }
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

// Start server function - ensures MongoDB is connected first
const startServer = async () => {
  try {
    // Connect to MongoDB FIRST and wait for connection
    console.log('🔄 Starting server initialization...');
    await connectDB();
    
    // Verify MongoDB connection before starting server
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection not established');
    }
    
    console.log('✅ MongoDB connection verified, starting HTTP server...');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    
    server.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 HEALINK BACKEND SERVER STARTED');
      console.log('='.repeat(60));
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth test: http://localhost:${PORT}/api/auth/test`);
      console.log(`📊 MongoDB: Connected to ${mongoose.connection.name}`);
      console.log('='.repeat(60) + '\n');
    });
  } catch (error) {
    console.error('\n❌ Failed to start server:');
    console.error(`   - Error: ${error.message}`);
    console.error('\n⚠️  Server will not start without MongoDB connection.');
    process.exit(1);
  }
};

// Start the server
startServer();
