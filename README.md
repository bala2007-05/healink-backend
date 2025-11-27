# HEALINK Smart IV Drip Monitoring System - Backend

Complete backend system for the HEALINK Smart IV Drip Monitoring System built with Node.js, Express.js, MongoDB, MQTT, and Socket.IO.

## Features

- **User Authentication**: JWT-based authentication for Nurses and Patients
- **Role-Based Access Control**: Separate permissions for NURSE and PATIENT roles
- **MQTT Integration**: Real-time telemetry data from ESP32/NodeMCU devices
- **Socket.IO**: Real-time data streaming to Flutter app
- **Device Management**: CRUD operations for IV drip monitoring devices
- **Telemetry Storage**: Historical data storage and retrieval
- **Alert System**: Alert generation and management
- **RESTful API**: Clean API endpoints for all operations

## Tech Stack

- **Node.js** (ES Modules)
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **MQTT** (HiveMQ) - IoT messaging
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=YOUR_MONGO_ATLAS_CONNECTION_STRING
JWT_SECRET=healinkSuperSecret123
MQTT_BROKER=mqtt://broker.hivemq.com:1883
```

3. Update `MONGO_URI` with your MongoDB Atlas connection string.

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register-nurse` - Register a new nurse
- `POST /api/auth/register-patient` - Register a new patient
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user (Protected)

### Devices
- `GET /api/devices` - Get all devices (Protected)
- `GET /api/devices/:id` - Get single device (Protected)
- `POST /api/devices` - Create device (NURSE only)
- `POST /api/devices/assign` - Assign device to patient (NURSE only)
- `POST /api/devices/send-command` - Send command to device (NURSE only)

### Telemetry
- `GET /api/telemetry/:deviceId` - Get telemetry data (Protected)
- `GET /api/telemetry/:deviceId/latest` - Get latest telemetry (Protected)

### Alerts
- `GET /api/alerts` - Get all alerts (NURSE only)
- `GET /api/alerts/:deviceId` - Get alerts for device (Protected)

## MQTT Topics

### Subscribed Topics
- `healink/device/+/telemetry` - Device telemetry data

### Published Topics
- `healink/device/<deviceId>/cmd` - Send commands to devices

## Socket.IO Events

### Emitted Events
- `device:update` - Device status update
- `telemetry:update` - New telemetry data
- `alert:new` - New alert generated

## Project Structure

```
backend/
  src/
    config/
      db.js          # MongoDB connection
      mqtt.js        # MQTT client setup
      socket.js      # Socket.IO setup
    controllers/
      authController.js
      deviceController.js
      telemetryController.js
      alertController.js
      userController.js
    middleware/
      authMiddleware.js    # JWT authentication
      roleMiddleware.js    # Role-based authorization
    models/
      User.js
      Device.js
      Telemetry.js
      Alert.js
    routes/
      authRoutes.js
      userRoutes.js
      deviceRoutes.js
      telemetryRoutes.js
      alertRoutes.js
    utils/
      generateToken.js
    server.js         # Main server file
  .env
  package.json
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Role-Based Access

- **NURSE**: Can access all devices, create devices, assign devices, send commands, view all alerts
- **PATIENT**: Can only access their assigned device and related telemetry/alerts

## MQTT Message Format

### Telemetry Message
```json
{
  "dripRate": 20,
  "flowStatus": "flowing",
  "bottleLevel": 75,
  "alert": null,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Command Message
```json
{
  "command": "start|stop|pause",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## License

ISC

