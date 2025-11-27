# MongoDB Atlas Setup Guide

## Fixing MongoDB Connection Error

The error you're seeing means your IP address is not whitelisted in MongoDB Atlas. Follow these steps:

### Step 1: Get Your Current IP Address

**Option A - Using PowerShell:**
```powershell
(Invoke-WebRequest -Uri "https://api.ipify.org").Content
```

**Option B - Using Browser:**
Visit: https://www.whatismyip.com/

### Step 2: Whitelist Your IP in MongoDB Atlas

1. **Log in to MongoDB Atlas:**
   - Go to: https://cloud.mongodb.com/
   - Sign in with your account

2. **Navigate to Network Access:**
   - Click on your project
   - Click "Network Access" in the left sidebar
   - Or go directly to: https://cloud.mongodb.com/v2#/security/network/whitelist

3. **Add IP Address:**
   - Click "Add IP Address" button
   - Choose one of these options:
     - **Option 1 (Recommended for Development):** Click "Add Current IP Address"
       - This automatically adds your current IP
     - **Option 2 (For Testing):** Enter `0.0.0.0/0`
       - ⚠️ **WARNING:** This allows access from ANY IP address
       - Only use for development/testing, NOT for production!
     - **Option 3 (Manual):** Enter your IP address manually
       - Format: `XXX.XXX.XXX.XXX/32` (e.g., `192.168.1.100/32`)

4. **Save:**
   - Click "Confirm" to add the IP address
   - Wait 1-2 minutes for changes to propagate

### Step 3: Verify Connection String

Make sure your `.env` file has the correct connection string:

```env
MONGO_URI=mongodb+srv://balachandhar2005:Healink%40123@cluster0.il3llym.mongodb.net/healink_db?retryWrites=true&w=majority&appName=Cluster0
```

**Important Notes:**
- The `%40` in the connection string is the URL-encoded version of `@`
- Make sure your username and password are correct
- The database name `healink_db` will be created automatically if it doesn't exist

### Step 4: Restart the Server

After whitelisting your IP:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

### Step 5: Verify Connection

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.il3llym.mongodb.net
```

Instead of the error message.

## Troubleshooting

### Still Getting Connection Error?

1. **Check IP Address Changed:**
   - If you're on a dynamic IP, it may have changed
   - Re-run the IP check and update MongoDB Atlas

2. **Check Connection String:**
   - Verify username and password are correct
   - Make sure special characters are URL-encoded

3. **Check MongoDB Atlas Status:**
   - Ensure your cluster is running (not paused)
   - Check if you have any billing issues

4. **Try Temporary Access:**
   - For quick testing, you can temporarily use `0.0.0.0/0`
   - Remember to remove this after testing!

5. **Check Firewall:**
   - Ensure your firewall isn't blocking MongoDB connections
   - Port 27017 (MongoDB) should be accessible

## Security Best Practices

- ✅ **For Development:** Use "Add Current IP Address" option
- ✅ **For Production:** Only whitelist specific IP addresses
- ❌ **Never use `0.0.0.0/0` in production** - it's a security risk
- ✅ Regularly review and remove unused IP addresses

## Quick Fix (Development Only)

If you need to test quickly and don't care about security for now:

1. Go to MongoDB Atlas Network Access
2. Click "Add IP Address"
3. Enter: `0.0.0.0/0`
4. Click "Confirm"
5. Wait 1-2 minutes
6. Restart your server

⚠️ **Remember to remove `0.0.0.0/0` after development!**

