// Debug JWT Token Contents
import jwt from 'jsonwebtoken';

console.log('🔍 Debugging JWT Token Contents');
console.log('===============================\n');

const BASE_URL = 'http://localhost:5002/api';
const JWT_SECRET = process.env.JWT_SECRET || 'hospital-management-secret-key-2024';

const testTokenContents = async () => {
  // Test with demo login token first
  console.log('1️⃣ Testing demo login token contents:');
  
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
      
      // Decode and inspect the token
      const decoded = jwt.verify(data.token, JWT_SECRET);
      console.log('📄 Token contents:', JSON.stringify(decoded, null, 2));
      
      // Test endpoint to see what middleware receives
      const testResponse = await fetch(`${BASE_URL}/ipd/patients`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      console.log(`📋 API Response Status: ${testResponse.status}`);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n2️⃣ Creating custom admin token:');
  
  // Create admin token with explicit role
  const adminUser = { 
    id: 1, 
    username: 'admin', 
    email: 'admin@hospital.com',
    role: 'admin'
  };
  
  const adminToken = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '2h' });
  console.log('✅ Admin token created');
  
  // Verify and display admin token contents
  const decoded = jwt.verify(adminToken, JWT_SECRET);
  console.log('📄 Admin token contents:', JSON.stringify(decoded, null, 2));
  
  // Test admin endpoint
  try {
    const testResponse = await fetch(`${BASE_URL}/staff/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    console.log(`📋 Staff API Response Status: ${testResponse.status}`);
    if (testResponse.status !== 200) {
      const errorText = await testResponse.text();
      console.log('📋 Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ API test error:', error.message);
  }
};

testTokenContents();