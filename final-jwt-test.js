// Test JWT with Correct Secret
import jwt from 'jsonwebtoken';

console.log('🔐 Testing JWT with Correct Demo Secret');
console.log('======================================\n');

const BASE_URL = 'http://localhost:5002/api';
const DEMO_JWT_SECRET = 'hardcoded_secret_for_demo'; // From demo login

const testWithCorrectSecret = async () => {
  console.log('1️⃣ Testing demo login (should work):');
  
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'doctor',
        password: 'password'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      console.log('✅ Demo token received');
      
      // Decode with correct secret
      const decoded = jwt.verify(data.token, DEMO_JWT_SECRET);
      console.log('📄 Demo token contents:', JSON.stringify(decoded, null, 2));
      
      // Test endpoint - but this will fail because token has no role
      const testResponse = await fetch(`${BASE_URL}/ipd/patients`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      console.log(`📋 IPD API Response Status: ${testResponse.status}`);
      if (testResponse.status !== 200) {
        const errorText = await testResponse.text();
        console.log('📋 Error (expected - no role):', errorText);
      }
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n2️⃣ Creating doctor token with demo secret:');
  
  // Create doctor token with role using DEMO secret
  const doctorUser = { 
    username: 'doctor',
    id: 2,
    role: 'doctor'  // Add role for middleware
  };
  
  const doctorToken = jwt.sign(doctorUser, DEMO_JWT_SECRET, { expiresIn: '2h' });
  console.log('✅ Doctor token created with role');
  
  // Test doctor endpoints
  try {
    const testResponse = await fetch(`${BASE_URL}/ipd/patients`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${doctorToken}`
      }
    });
    
    console.log(`📋 IPD API Response Status: ${testResponse.status}`);
    if (testResponse.status === 200) {
      console.log('🎉 Doctor access granted!');
    } else {
      const errorText = await testResponse.text();
      console.log('📋 Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ API test error:', error.message);
  }
  
  console.log('\n3️⃣ Creating admin token with demo secret:');
  
  // Create admin token with role using DEMO secret  
  const adminUser = { 
    username: 'admin',
    id: 1,
    role: 'admin'  // Add role for middleware
  };
  
  const adminToken = jwt.sign(adminUser, DEMO_JWT_SECRET, { expiresIn: '2h' });
  console.log('✅ Admin token created with role');
  
  // Test admin endpoints
  try {
    const testResponse = await fetch(`${BASE_URL}/staff/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    console.log(`📋 Staff API Response Status: ${testResponse.status}`);
    if (testResponse.status === 200) {
      console.log('🎉 Admin access granted!');
    } else {
      const errorText = await testResponse.text();
      console.log('📋 Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ API test error:', error.message);
  }
};

testWithCorrectSecret();