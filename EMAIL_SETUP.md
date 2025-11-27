# Email Configuration for Password Reset

## Setup Instructions

To enable email-based OTP for password reset, you need to configure Gmail SMTP in your `.env` file.

### Step 1: Create Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable it if not already enabled)
3. Scroll down to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "HEALINK Backend" as the name
6. Click **Generate**
7. Copy the 16-character password (you'll need this)

### Step 2: Add to .env File

Add these lines to your `backend/.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

**Example:**
```env
EMAIL_USER=healink.app@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 3: Restart Backend Server

After adding the email credentials, restart your backend server:

```bash
cd backend
npm start
```

### Step 4: Verify Email Configuration

The backend will automatically verify email configuration on startup. Check the console logs for:

- ✅ `Email service is properly configured` - Email is ready
- ⚠️ `Email credentials not set` - Add EMAIL_USER and EMAIL_PASSWORD to .env

## Troubleshooting

### Email Not Sending

1. **Check .env file**: Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set correctly
2. **Verify App Password**: Make sure you're using the App Password, not your regular Gmail password
3. **Check 2-Step Verification**: App passwords only work if 2-Step Verification is enabled
4. **Check Console Logs**: Look for email sending errors in backend console

### Common Errors

- **"Invalid login"**: Wrong email or app password
- **"Less secure app access"**: Use App Password instead of regular password
- **"Connection timeout"**: Check internet connection or firewall settings

## Email Template

The OTP email includes:
- Professional HTML design
- 6-digit OTP code
- Expiration time (10 minutes)
- Security warnings
- HEALINK branding

## Testing

To test email functionality:

1. Start the backend server
2. Use the forgot password feature in the app
3. Check the email inbox for the OTP code
4. Enter the OTP in the app to verify

## Notes

- OTP expires in 10 minutes
- Each OTP can only be used once
- Users can request a new OTP using the "Resend OTP" button

