import http from 'http';

console.log('🔍 Checking Backend Status...\n');

// Test health endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET',
  timeout: 3000,
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ Backend is RUNNING!');
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Response: ${data}`);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.log('❌ Backend is NOT running');
  console.log(`Error: ${error.message}`);
  console.log('\n💡 To start the backend:');
  console.log('   cd backend');
  console.log('   npm start');
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ Backend connection timeout');
  console.log('   Server might be starting or not responding');
  req.destroy();
  process.exit(1);
});

req.end();

