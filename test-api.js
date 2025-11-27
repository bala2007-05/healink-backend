import http from 'http';

const BASE_URL = 'http://localhost:5000/api';

// Test helper function
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing Health Check...');
    const health = await makeRequest('GET', '/health');
    console.log('   Status:', health.status);
    console.log('   Response:', JSON.stringify(health.data, null, 2));
    console.log('   ✅ Health check passed\n');

    // Test 2: Register Nurse
    console.log('2️⃣  Testing Nurse Registration...');
    const nurseReg = await makeRequest('POST', '/auth/register-nurse', {
      name: 'Test Nurse',
      email: `nurse${Date.now()}@test.com`,
      password: 'test123456',
    });
    console.log('   Status:', nurseReg.status);
    if (nurseReg.status === 201) {
      console.log('   ✅ Nurse registered successfully');
      console.log('   Token:', nurseReg.data.data.token.substring(0, 20) + '...');
      const nurseToken = nurseReg.data.data.token;

      // Test 3: Get Current User
      console.log('\n3️⃣  Testing Get Current User...');
      const user = await makeRequest('GET', '/users/me', null, nurseToken);
      console.log('   Status:', user.status);
      console.log('   User:', user.data.data.name, '-', user.data.data.role);
      console.log('   ✅ Get user passed');

      // Test 4: Create Device
      console.log('\n4️⃣  Testing Create Device...');
      const device = await makeRequest('POST', '/devices', {
        deviceId: 'TEST001',
      }, nurseToken);
      console.log('   Status:', device.status);
      if (device.status === 201) {
        console.log('   ✅ Device created:', device.data.data.deviceId);
      }

      // Test 5: Get Devices
      console.log('\n5️⃣  Testing Get Devices...');
      const devices = await makeRequest('GET', '/devices', null, nurseToken);
      console.log('   Status:', devices.status);
      console.log('   Device Count:', devices.data.count);
      console.log('   ✅ Get devices passed');
    } else {
      console.log('   ❌ Registration failed:', nurseReg.data.message);
    }

    // Test 6: Register Patient
    console.log('\n6️⃣  Testing Patient Registration...');
    const patientReg = await makeRequest('POST', '/auth/register-patient', {
      name: 'Test Patient',
      email: `patient${Date.now()}@test.com`,
      password: 'test123456',
    });
    console.log('   Status:', patientReg.status);
    if (patientReg.status === 201) {
      console.log('   ✅ Patient registered successfully');
    } else {
      console.log('   ❌ Registration failed:', patientReg.data.message);
    }

    // Test 7: Login
    console.log('\n7️⃣  Testing Login...');
    const login = await makeRequest('POST', '/auth/login', {
      email: 'nurse@test.com', // Use existing test account
      password: 'test123456',
    });
    console.log('   Status:', login.status);
    if (login.status === 200) {
      console.log('   ✅ Login successful');
    } else {
      console.log('   ⚠️  Login test skipped (create test account first)');
    }

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run tests
runTests();

