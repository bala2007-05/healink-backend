# Backend Testing Guide

## Prerequisites

1. Make sure the backend server is running:
```bash
cd backend
npm start
```

2. Verify MongoDB connection is working (check server logs)

## Testing API Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register Nurse
```bash
curl -X POST http://localhost:5000/api/auth/register-nurse \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Nurse",
    "email": "nurse@test.com",
    "password": "test123456"
  }'
```

### 3. Register Patient
```bash
curl -X POST http://localhost:5000/api/auth/register-patient \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "email": "patient@test.com",
    "password": "test123456"
  }'
```

### 4. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nurse@test.com",
    "password": "test123456"
  }'
```

Save the token from the response for authenticated requests.

### 5. Get Current User (Protected)
```bash
curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get Devices (Protected)
```bash
curl http://localhost:5000/api/devices \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Create Device (NURSE only)
```bash
curl -X POST http://localhost:5000/api/devices \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "DEV001"
  }'
```

### 8. Get Telemetry (Protected)
```bash
curl http://localhost:5000/api/telemetry/DEV001 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Get Alerts (Protected)
```bash
curl http://localhost:5000/api/alerts/DEV001 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testing MQTT

### Run MQTT Test Script
```bash
cd backend
node test-mqtt.js
```

This will:
- Connect to HiveMQ broker
- Send test telemetry data for devices: DEV001, DEV002, DEV003
- The backend should receive and store this data
- Check server logs to see telemetry being processed

### Manual MQTT Test (using MQTT client)

**Subscribe to telemetry:**
```
Topic: healink/device/+/telemetry
```

**Publish test message:**
```
Topic: healink/device/DEV001/telemetry
Message:
{
  "dripRate": 20,
  "flowStatus": "flowing",
  "bottleLevel": 75,
  "alert": null,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Testing Flutter Integration

1. **Update API base URL** in `lib/services/api_service.dart`:
   - For Android emulator: Use `http://10.0.2.2:5000/api`
   - For physical device: Use your computer's IP address
   - For iOS simulator: Use `http://localhost:5000/api`

2. **Install Flutter dependencies:**
```bash
flutter pub get
```

3. **Run the app:**
```bash
flutter run
```

4. **Test login:**
   - Use the credentials you registered via API
   - The app should authenticate and navigate to dashboard

## Socket.IO Testing

The backend automatically emits Socket.IO events when:
- New telemetry data arrives via MQTT
- New alerts are created
- Device status updates

To test Socket.IO:
1. Connect a Socket.IO client to `http://localhost:5000`
2. Listen for events: `device:update`, `telemetry:update`, `alert:new`
3. Send MQTT messages and observe Socket.IO events

## Troubleshooting

### Server won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas allows connections from your IP
- Check if port 5000 is already in use

### MQTT not connecting
- HiveMQ public broker should work automatically
- Check internet connection
- Verify broker URL in `.env`

### API returns 401 Unauthorized
- Ensure token is included in Authorization header
- Check token hasn't expired
- Verify user exists in database

### Flutter can't connect
- For Android emulator: Use `10.0.2.2` instead of `localhost`
- For physical device: Use your computer's local IP address
- Check firewall settings
- Ensure backend server is running

