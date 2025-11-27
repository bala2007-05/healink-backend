# 🔧 Quick Email Setup - FIX THE ERROR

## ❌ Current Error:
```
Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env file
```

## ✅ Solution:

### Step 1: Get Gmail App Password

1. **Go to:** https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords

2. **Select:**
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name: **HEALINK Backend**

3. **Click "Generate"**

4. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Edit backend/.env File

Open `backend/.env` and **ADD these two lines** at the end:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Example:**
```env
EMAIL_USER=balachandhar2005@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**⚠️ IMPORTANT:**
- Remove **ALL SPACES** from the app password
- Use your **real Gmail address**
- Don't use quotes
- Don't add comments on the same line

### Step 3: Restart Backend Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
cd backend
npm start
```

### Step 4: Verify

When server starts, you should see:
```
📧 Verifying email configuration...
✅ Email credentials found in .env
   Testing SMTP connection...
✅ Email service is properly configured and verified!
✅ Email service: Ready
```

## 🧪 Test Email

After setup, test it:

**Option 1: Via API**
```
POST https://unfogged-maxton-irenically.ngrok-free.dev/api/auth/test-send-email
Body: {"email": "your-email@gmail.com"}
```

**Option 2: Via App**
- Use "Forgot Password" in the app
- Check your email inbox

## ⚠️ Common Mistakes

1. ❌ Using regular Gmail password → ✅ Use App Password
2. ❌ Not enabling 2-Step Verification → ✅ Enable it first
3. ❌ Leaving spaces in app password → ✅ Remove all spaces
4. ❌ Wrong .env file location → ✅ Must be in `backend/` folder
5. ❌ Not restarting server → ✅ Restart after adding credentials

## 🆘 Still Not Working?

1. Check backend console for detailed error messages
2. Verify .env file has correct format (no quotes, no spaces)
3. Test email config: `GET /api/auth/test-email`
4. Check Gmail account security settings

---

**Note:** Until email is configured, OTP will be shown in backend console for testing.

