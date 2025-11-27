# Backend Status Check

## Current Status: ❌ NOT RUNNING

The backend server is currently not running.

## To Start the Backend:

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

## Expected Output When Running:

When the backend starts successfully, you should see:
```
MongoDB Connected: cluster0-shard-00-00.il3llym.mongodb.net
Server running on port 5000
Health check: http://localhost:5000/api/health
MQTT Broker Connected
Subscribed to: healink/device/+/telemetry
```

## Common Issues:

### 1. MongoDB Connection Error
**Error:** `Could not connect to any servers in your MongoDB Atlas cluster`

**Solution:**
- Check your MongoDB Atlas IP whitelist
- Add your current IP address: https://cloud.mongodb.com/v2#/security/network/whitelist
- Or temporarily use `0.0.0.0/0` for development (NOT for production)

**Your IP:** Check with: `(Invoke-WebRequest -Uri "https://api.ipify.org").Content`

### 2. Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
- Find and kill the process using port 5000
- Or change PORT in `.env` file

### 3. Missing .env File
**Error:** `MONGO_URI is not defined`

**Solution:**
- Create `.env` file in `backend/` directory
- Add your MongoDB connection string

## Test Backend:

Once running, test with:
```bash
# Health check
curl http://localhost:5000/api/health

# Or use the test script
node check-backend.js
```

## API Endpoints Available:

- `GET /api/health` - Health check
- `POST /api/auth/register-nurse` - Register nurse
- `POST /api/auth/register-patient` - Register patient
- `POST /api/auth/login` - Login
- `GET /api/users/me` - Get current user (requires auth)
- `GET /api/devices` - Get all devices (requires auth)
- `GET /api/telemetry/:deviceId` - Get telemetry (requires auth)
- `GET /api/alerts/:deviceId` - Get alerts (requires auth)

## Next Steps:

1. Start the backend server
2. Verify MongoDB connection
3. Test API endpoints
4. Connect Flutter app to backend

