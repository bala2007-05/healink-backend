# Quick Email Setup Guide

## Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Or: Google Account → Security → 2-Step Verification → App passwords
3. Select "Mail" and "Other (Custom name)"
4. Name: "HEALINK Backend"
5. Click "Generate"
6. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

## Step 2: Add to .env File

Open `backend/.env` and add:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Important:**
- Remove spaces from the app password
- Use your full Gmail address
- Don't use quotes around values

## Step 3: Restart Backend

```bash
cd backend
npm start
```

## Step 4: Check Server Logs

When server starts, you should see:

```
📧 Verifying email configuration...
✅ Email credentials found in .env
   Testing SMTP connection...
✅ Email service is properly configured and verified!
✅ Email service: Ready
```

If you see errors, check the error message.

## Step 5: Test Email

### Option 1: Test via API

```bash
# Test email configuration
curl http://localhost:5000/api/auth/test-email

# Test send email (replace with your email)
curl -X POST http://localhost:5000/api/auth/test-send-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

### Option 2: Test via App

1. Open the app
2. Click "Forgot Password"
3. Enter your email
4. Check your email inbox (and spam folder)

## Troubleshooting

### Error: "Email authentication failed"
- ✅ Check EMAIL_USER is your full Gmail address
- ✅ Check EMAIL_PASSWORD is the App Password (not regular password)
- ✅ Remove spaces from App Password
- ✅ Make sure 2-Step Verification is enabled

### Error: "Email credentials not configured"
- ✅ Check .env file exists in `backend/` folder
- ✅ Check EMAIL_USER and EMAIL_PASSWORD are set
- ✅ Restart backend server after adding credentials

### Email not received
- ✅ Check spam/junk folder
- ✅ Wait 1-2 minutes (Gmail can be slow)
- ✅ Check server logs for email sending errors
- ✅ Verify email address is correct

### Still not working?
1. Check backend console for detailed error messages
2. Test email config: `GET /api/auth/test-email`
3. Test send email: `POST /api/auth/test-send-email`
4. Check Gmail account security settings

