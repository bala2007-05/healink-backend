import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import generateToken from './src/utils/generateToken.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

async function testAuthFlow() {
  await connectDB();

  console.log('🧪 TESTING AUTHENTICATION FLOW\n');
  console.log('='.repeat(60));

  try {
    // Check existing users
    const existingUsers = await User.find().select('-password');
    console.log('\n📋 EXISTING USERS IN DATABASE:');
    if (existingUsers.length === 0) {
      console.log('  No users found. Register users through the app.\n');
    } else {
      existingUsers.forEach((user, index) => {
        console.log(`\n  User ${index + 1}:`);
        console.log(`    ID: ${user._id}`);
        console.log(`    Name: ${user.name}`);
        console.log(`    Email: ${user.email}`);
        console.log(`    Role: ${user.role}`);
        console.log(`    Assigned Device: ${user.assignedDevice || 'None'}`);
        console.log(`    Created: ${user.createdAt}`);
        
        // Generate token for testing
        const token = generateToken(user._id);
        console.log(`    Test Token: ${token.substring(0, 50)}...`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Authentication flow test complete!');
    console.log('\n💡 To test login:');
    console.log('   1. Use the Flutter app to register/login');
    console.log('   2. Check MongoDB Atlas to see stored users');
    console.log('   3. Use the generated tokens for API testing');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await mongoose.connection.close();
  console.log('\n✅ Connection closed');
}

testAuthFlow().catch(console.error);

