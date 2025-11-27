import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For Gmail, you can use OAuth2 or App Password
  // For development, using SMTP with App Password
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;
  
  console.log('📧 Creating email transporter...');
  console.log(`   EMAIL_USER: ${emailUser ? '✅ Set' : '❌ Missing'}`);
  console.log(`   EMAIL_PASSWORD: ${emailPass ? '✅ Set (hidden)' : '❌ Missing'}`);
  
  if (!emailUser || !emailPass) {
    throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env file');
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass.replace(/\s/g, ''), // Remove spaces from app password
    },
    debug: true, // Enable debug mode
    logger: true, // Enable logging
  });
};

// Send OTP email
export const sendOtpEmail = async (email, otp) => {
  try {
    console.log('📧 Attempting to send OTP email...');
    console.log(`   To: ${email}`);
    console.log(`   OTP: ${otp}`);
    
    // Check if email credentials are configured
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    
    if (!emailUser || !emailPass) {
      const errorMsg = 'Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env file';
      console.error('❌', errorMsg);
      console.error('   Current .env status:');
      console.error(`   EMAIL_USER: ${emailUser ? '✅ Set' : '❌ Missing'}`);
      console.error(`   EMAIL_PASSWORD: ${emailPass ? '✅ Set' : '❌ Missing'}`);
      console.error('   📝 To fix: Add these lines to backend/.env file:');
      console.error('      EMAIL_USER=your-email@gmail.com');
      console.error('      EMAIL_PASSWORD=your-16-character-app-password');
      console.error('   📖 See backend/EMAIL_QUICK_SETUP.md for detailed instructions');
      return { success: false, message: errorMsg };
    }

    console.log('📧 Creating email transporter...');
    const transporter = createTransporter();
    
    // Verify connection before sending
    console.log('📧 Verifying email transporter connection...');
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');

    const mailOptions = {
      from: `"HEALINK" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'HEALINK - Password Reset OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              border: 1px solid #e0e0e0;
            }
            .header {
              text-align: center;
              color: #0D8ABC;
              margin-bottom: 30px;
            }
            .otp-box {
              background-color: #ffffff;
              border: 2px solid #0D8ABC;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #0D8ABC;
              letter-spacing: 8px;
              margin: 10px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            
            <p>Hello,</p>
            
            <p>You have requested to reset your password for your HEALINK account.</p>
            
            <p>Please use the following OTP (One-Time Password) to verify your identity:</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #666;">Your OTP Code:</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Valid for 10 minutes</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This OTP will expire in 10 minutes</li>
                <li>Do not share this OTP with anyone</li>
                <li>If you did not request this, please ignore this email</li>
              </ul>
            </div>
            
            <p>Enter this OTP in the HEALINK app to proceed with password reset.</p>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} HEALINK. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        HEALINK - Password Reset OTP
        
        You have requested to reset your password.
        
        Your OTP Code: ${otp}
        Valid for: 10 minutes
        
        Enter this OTP in the HEALINK app to proceed.
        
        ⚠️ Security Notice:
        - This OTP will expire in 10 minutes
        - Do not share this OTP with anyone
        - If you did not request this, please ignore this email
        
        This is an automated message. Please do not reply to this email.
      `,
    };

    console.log('📧 Sending email...');
    console.log('   From:', process.env.EMAIL_USER);
    console.log('   To:', email);
    console.log('   Subject: HEALINK - Password Reset OTP');
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ OTP email sent successfully!');
    console.log('   To:', email);
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('   Accepted:', info.accepted);
    console.log('   Rejected:', info.rejected);

    if (info.rejected && info.rejected.length > 0) {
      console.error('⚠️ Email was rejected:', info.rejected);
      return {
        success: false,
        message: `Email was rejected by server: ${info.rejected.join(', ')}`,
        rejected: info.rejected,
      };
    }

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
    };
  } catch (error) {
    console.error('❌ Error sending OTP email:');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    console.error('   Full error:', error);
    
    // Provide helpful error messages
    let errorMessage = error.message || 'Failed to send email';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your EMAIL_USER and EMAIL_PASSWORD in .env file. Make sure you are using a Gmail App Password, not your regular password.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to Gmail SMTP server. Check your internet connection.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Email sending timed out. Please try again.';
    }
    
    return {
      success: false,
      message: errorMessage,
      errorCode: error.code,
    };
  }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    console.log('\n📧 Verifying email configuration...');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('❌ Email credentials not set in environment variables');
      return {
        configured: false,
        message: 'Email credentials not set in environment variables',
        details: {
          EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
          EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Missing',
        },
      };
    }

    console.log('✅ Email credentials found in .env');
    console.log('   Testing SMTP connection...');
    
    const transporter = createTransporter();
    await transporter.verify();
    
    console.log('✅ Email service is properly configured and verified!');
    
    return {
      configured: true,
      message: 'Email service is properly configured',
      emailUser: process.env.EMAIL_USER,
    };
  } catch (error) {
    console.error('❌ Email configuration verification failed:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    
    return {
      configured: false,
      message: `Email configuration error: ${error.message}`,
      errorCode: error.code,
    };
  }
};

