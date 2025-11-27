// Quick email test script
// Run: node test-email.js

import dotenv from 'dotenv';
dotenv.config();

import { sendOtpEmail, verifyEmailConfig } from './src/utils/emailService.js';

async function testEmail() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTING EMAIL CONFIGURATION');
  console.log('='.repeat(60) + '\n');

  // Step 1: Check configuration
  console.log('Step 1: Checking email configuration...');
  const config = await verifyEmailConfig();
  
  if (!config.configured) {
    console.error('❌ Email not configured!');
    console.error('   Error:', config.message);
    console.error('\n📝 To fix:');
    console.error('   1. Get Gmail App Password: https://myaccount.google.com/apppasswords');
    console.error('   2. Add to backend/.env:');
    console.error('      EMAIL_USER=your-email@gmail.com');
    console.error('      EMAIL_PASSWORD=your-16-character-app-password');
    process.exit(1);
  }

  console.log('✅ Email configuration verified!');
  console.log('   Email:', config.emailUser);
  console.log('');

  // Step 2: Test sending email
  const testEmail = process.argv[2] || process.env.EMAIL_USER;
  
  if (!testEmail) {
    console.error('❌ Please provide an email address to test');
    console.error('   Usage: node test-email.js your-email@gmail.com');
    process.exit(1);
  }

  console.log('Step 2: Testing email send...');
  console.log('   Sending test OTP to:', testEmail);
  console.log('');

  const result = await sendOtpEmail(testEmail, '123456');

  if (result.success) {
    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log('   Check your inbox (and spam folder) for the test email.');
    console.log('   Message ID:', result.messageId);
  } else {
    console.error('\n❌ FAILED! Email could not be sent');
    console.error('   Error:', result.message);
    console.error('   Error Code:', result.errorCode);
    console.error('\n📝 Troubleshooting:');
    console.error('   1. Check EMAIL_USER and EMAIL_PASSWORD in .env');
    console.error('   2. Verify Gmail App Password is correct');
    console.error('   3. Make sure 2-Step Verification is enabled');
    console.error('   4. Check Gmail account security settings');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ EMAIL TEST COMPLETE');
  console.log('='.repeat(60) + '\n');
}

testEmail().catch(console.error);

