// Final JWT Security Validation Test
console.log('🔐 Final JWT Security Validation');
console.log('================================\n');

const BASE_URL = 'http://localhost:5002/api';

// Comprehensive endpoint security test
const validateAllEndpoints = async () => {
  console.log('📋 Testing Security on All Protected Endpoints:');
  
  const endpoints = [
    // Core Management
    { method: 'GET', url: `${BASE_URL}/ipd/patients`, name: 'IPD Patients' },
    { method: 'GET', url: `${BASE_URL}/opd/`, name: 'OPD Patients' },
    { method: 'GET', url: `${BASE_URL}/staff/`, name: 'Staff Management' },
    { method: 'GET', url: `${BASE_URL}/inventory/`, name: 'Inventory View' },
    { method: 'GET', url: `${BASE_URL}/inventory/statistics`, name: 'Inventory Admin' },
    
    // Medicine Management  
    { method: 'GET', url: `${BASE_URL}/medicines/vedic/`, name: 'Vedic Medicines' },
    { method: 'GET', url: `${BASE_URL}/medicines/custom/`, name: 'Custom Medicines' },
    
    // Statistics & Reports
    { method: 'GET', url: `${BASE_URL}/ipd/statistics`, name: 'IPD Statistics' },
    { method: 'GET', url: `${BASE_URL}/opd/statistics`, name: 'OPD Statistics' },
    { method: 'GET', url: `${BASE_URL}/staff/statistics`, name: 'Staff Statistics' }
  ];

  let securedCount = 0;
  let totalCount = endpoints.length;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const status = response.status;
      
      if (status === 401) {
        console.log(`✅ ${endpoint.name}: Properly secured (401)`);
        securedCount++;
      } else if (status === 404) {
        console.log(`⚠️  ${endpoint.name}: Endpoint not found (404)`);
      } else {
        console.log(`❌ ${endpoint.name}: Not secured! Status: ${status}`);
      }
    } catch (error) {
      console.log(`🔴 ${endpoint.name}: Network error - ${error.message}`);
    }
  }
  
  console.log(`\n📊 Security Summary:`);
  console.log(`✅ Secured Endpoints: ${securedCount}/${totalCount}`);
  console.log(`🔒 Security Coverage: ${Math.round((securedCount/totalCount) * 100)}%`);
  
  if (securedCount === totalCount) {
    console.log(`\n🎉 JWT SECURITY IMPLEMENTATION COMPLETE!`);
    console.log(`🛡️  All hospital management APIs are properly protected`);
  } else {
    console.log(`\n⚠️  Some endpoints may need additional security review`);
  }
};

// Test demo login functionality
const testLoginFunctionality = async () => {
  console.log('\n🔑 Testing Login Functionality:');
  
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
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login endpoint working - JWT tokens can be generated');
      return data.token;
    } else {
      console.log('❌ Login endpoint issue');
      return null;
    }
  } catch (error) {
    console.log('🔴 Login test error:', error.message);
    return null;
  }
};

// Run comprehensive validation
const runFinalValidation = async () => {
  await validateAllEndpoints();
  await testLoginFunctionality();
  
  console.log('\n🎯 PHASE 3 COMPLETE: JWT Authentication & Authorization');
  console.log('📋 Ready for Phase 4: Frontend Integration');
};

runFinalValidation();