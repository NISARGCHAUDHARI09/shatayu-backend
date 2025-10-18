// Debug JWT Token Contents
import jwt from 'jsonwebtoken';

console.log('🔍 Debugging JWT Token Structure');
console.log('================================\n');

const BASE_URL = 'http://localhost:5002/api';
const JWT_SECRET = 'hardcoded_secret_for_demo';

const debugTokens = async () => {
  // Get demo token
  console.log('1️⃣ Getting demo login token...');
  
  const loginResponse = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'doctor', password: 'password' })
  });
  
  const loginData = await loginResponse.json();
  const demoToken = loginData.token;
  
  console.log('🔑 Demo token received');
  
  // Decode demo token
  try {
    const decoded = jwt.verify(demoToken, JWT_SECRET);
    console.log('📄 Demo token contents:', JSON.stringify(decoded, null, 2));
  } catch (error) {
    console.log('❌ Demo token decode failed:', error.message);
    
    // Try different secrets
    const secrets = [
      'hardcoded_secret_for_demo',
      'hospital-management-secret-key-2024',
      '2fcdd278de57cbc5b12644850b53a4dfc87e6b67d57a6ad185a5b116d973fb1078343f00ec7a93c60b4b290b5fc0bc6dcfb49b233db3a6c30078656c16fcd61f'
    ];
    
    for (const secret of secrets) {
      try {
        const decoded = jwt.verify(demoToken, secret);
        console.log(`✅ Token decoded with secret: ${secret}`);
        console.log('📄 Demo token contents:', JSON.stringify(decoded, null, 2));
        break;
      } catch (err) {
        console.log(`❌ Failed with secret: ${secret.substring(0, 20)}...`);
      }
    }
  }
  
  // Test creating proper doctor token
  console.log('\n2️⃣ Creating proper doctor token...');
  
  const doctorUser = {
    id: 2,
    username: 'doctor',
    email: 'doctor@hospital.com',
    role: 'doctor'
  };
  
  const doctorToken = jwt.sign(doctorUser, JWT_SECRET, { expiresIn: '2h' });
  console.log('🩺 Doctor token created');
  
  // Test doctor token
  console.log('\n3️⃣ Testing doctor token access...');
  
  const testResponse = await fetch(`${BASE_URL}/ipd/patients`, {
    headers: {
      'Authorization': `Bearer ${doctorToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log(`📋 IPD API response: ${testResponse.status}`);
  
  if (testResponse.status !== 200) {
    const errorText = await testResponse.text();
    console.log('📋 Error response:', errorText);
  }
};

debugTokens().catch(console.error);