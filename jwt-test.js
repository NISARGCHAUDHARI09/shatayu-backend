// JWT Protection Test Script
console.log('🔐 Testing JWT Protection on All Endpoints');
console.log('=========================================\n');

const BASE_URL = 'http://localhost:5002/api';

// Test endpoints without authentication (should return 401)
const testUnauthenticatedEndpoints = async () => {
  console.log('📝 Testing Unauthenticated Access (expecting 401 errors):');
  
  const endpoints = [
    { method: 'GET', url: `${BASE_URL}/ipd/patients`, name: 'IPD Patients' },
    { method: 'GET', url: `${BASE_URL}/opd/`, name: 'OPD Patients' },
    { method: 'GET', url: `${BASE_URL}/staff/`, name: 'Staff List' },
    { method: 'GET', url: `${BASE_URL}/inventory/`, name: 'Inventory Items' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const status = response.status;
      const result = await response.text();
      
      if (status === 401) {
        console.log(`✅ ${endpoint.name}: Correctly blocked (401)`);
      } else {
        console.log(`❌ ${endpoint.name}: Not protected! Status: ${status}`);
        console.log(`   Response: ${result.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`🔴 ${endpoint.name}: Network error - ${error.message}`);
    }
  }
};

// Test login to get valid token
const testLogin = async () => {
  console.log('\n🔑 Testing Login to Get Valid Token:');
  
  // First try the auth route
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@hospital.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      console.log('✅ Login successful! Token received.');
      return data.token;
    } else {
      console.log('❌ Auth login failed:', data.message || 'Unknown error');
    }
  } catch (error) {
    console.log('🔴 Auth login error:', error.message);
  }
  
  // Try the demo login route as fallback
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
      console.log('✅ Demo login successful! Token received.');
      return data.token;
    } else {
      console.log('❌ Demo login failed:', data.message || 'Unknown error');
      return null;
    }
  } catch (error) {
    console.log('🔴 Demo login error:', error.message);
    return null;
  }
};

// Test endpoints with valid token
const testAuthenticatedEndpoints = async (token) => {
  console.log('\n📝 Testing Authenticated Access:');
  
  const endpoints = [
    { method: 'GET', url: `${BASE_URL}/ipd/patients`, name: 'IPD Patients' },
    { method: 'GET', url: `${BASE_URL}/opd/`, name: 'OPD Patients' },
    { method: 'GET', url: `${BASE_URL}/staff/`, name: 'Staff List' },
    { method: 'GET', url: `${BASE_URL}/inventory/`, name: 'Inventory Items' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const status = response.status;
      
      if (status === 200) {
        console.log(`✅ ${endpoint.name}: Access granted (200)`);
      } else if (status === 403) {
        console.log(`⚠️  ${endpoint.name}: Role forbidden (403)`);
      } else {
        console.log(`❌ ${endpoint.name}: Unexpected status: ${status}`);
      }
    } catch (error) {
      console.log(`🔴 ${endpoint.name}: Network error - ${error.message}`);
    }
  }
};

// Run all tests
const runTests = async () => {
  await testUnauthenticatedEndpoints();
  
  const token = await testLogin();
  if (token) {
    await testAuthenticatedEndpoints(token);
  }
  
  console.log('\n🎯 JWT Protection Test Complete!');
};

runTests();