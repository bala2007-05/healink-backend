import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from .env file');
    }

    console.log('\n🔌 Connecting to MongoDB...');
    console.log('   - URI: Set (hidden for security)');
    console.log('   - Database: healink_db');
    
    // Connect with timeout
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   - Database: ${conn.connection.name}`);
    console.log(`   - Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Verify connection by listing collections
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log(`   - Collections: ${collections.length} found`);
      collections.forEach(col => {
        console.log(`     • ${col.name}`);
      });
    } catch (err) {
      console.log('   - Could not list collections (may be normal for new database)');
    }
    
    console.log('✅ MongoDB connection verified and ready\n');
    
    return conn;
  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:');
    console.error(`   - Error: ${error.message}`);
    console.error(`   - Error Code: ${error.code || 'N/A'}`);
    
    if (error.message.includes('MONGO_URI is missing')) {
      console.error('\n⚠️  Solution:');
      console.error('   1. Create a .env file in the backend/ directory');
      console.error('   2. Add: MONGO_URI=your_mongodb_connection_string');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n⚠️  Solution:');
      console.error('   1. Check your MongoDB username and password');
      console.error('   2. Ensure password is URL-encoded (e.g., @ becomes %40)');
    } else if (error.message.includes('IP')) {
      console.error('\n⚠️  Solution:');
      console.error('   1. Whitelist your IP address in MongoDB Atlas');
      console.error('   2. Go to Network Access → Add IP Address');
    }
    
    console.error('\n⚠️  MongoDB Connection Troubleshooting:');
    console.error('   1. Check if your IP address is whitelisted in MongoDB Atlas');
    console.error('   2. Verify your connection string is correct');
    console.error('   3. Ensure your MongoDB Atlas cluster is running');
    console.error('   4. Check network/firewall settings');
    console.error('   5. Verify password is URL-encoded (special characters)');
    
    process.exit(1);
  }
};

export default connectDB;
