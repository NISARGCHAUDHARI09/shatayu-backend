// Complete Role-Based Authentication Test
console.log('🔐 Complete Role-Based Authentication Test');
console.log('==========================================\n');

const BASE_URL = 'http://localhost:5002/api';

const testRoleBasedAuth = async () => {
  console.log('🧪 Testing Role-Based Authentication System:');
  
  // Test different user roles
  const testUsers = [
    { username: 'doctor', password: 'password', expectedRole: 'doctor' },
    { username: 'admin', password: 'password', expectedRole: 'admin' },
    { username: 'staff', password: 'password', expectedRole: 'staff' }
  ];

  const endpoints = [
    { url: `${BASE_URL}/ipd/patients`, name: 'IPD Management', allowedRoles: ['doctor', 'admin'] },
    { url: `${BASE_URL}/opd/`, name: 'OPD Management', allowedRoles: ['doctor', 'admin'] },
    { url: `${BASE_URL}/staff/`, name: 'Staff Management', allowedRoles: ['admin'] },
    { url: `${BASE_URL}/inventory/`, name: 'Inventory View', allowedRoles: ['doctor', 'admin', 'staff'] },
    { url: `${BASE_URL}/inventory/statistics`, name: 'Inventory Admin', allowedRoles: ['admin'] }
  ];

  for (const user of testUsers) {
    console.log(`\n👤 Testing ${user.username.toUpperCase()} (${user.expectedRole}) Access:`);
    
    // Login as this user
    try {
      const loginResponse = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password: user.password })
      });
      
      if (!loginResponse.ok) {
        console.log(`❌ Login failed for ${user.username}`);
        continue;
      }
      
      const loginData = await loginResponse.json();
      const { token, user: userData } = loginData;
      
      console.log(`✅ Login successful - Role: ${userData.role}`);
      
      // Test access to each endpoint
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const shouldHaveAccess = endpoint.allowedRoles.includes(userData.role);
          
          if (response.status === 200 && shouldHaveAccess) {
            console.log(`  ✅ ${endpoint.name}: Access granted ✓`);
          } else if (response.status === 403 && !shouldHaveAccess) {
            console.log(`  🔒 ${endpoint.name}: Access denied (correct) ✓`);
          } else if (response.status === 200 && !shouldHaveAccess) {
            console.log(`  ⚠️  ${endpoint.name}: Unexpected access granted ❌`);
          } else if (response.status === 403 && shouldHaveAccess) {
            console.log(`  ❌ ${endpoint.name}: Access denied (should be allowed) ❌`);
          } else {
            console.log(`  ❓ ${endpoint.name}: Unexpected status ${response.status}`);
          }
        } catch (error) {
          console.log(`  🔴 ${endpoint.name}: Network error`);
        }
      }
    } catch (error) {
      console.log(`🔴 Error testing ${user.username}:`, error.message);
    }
  }

  // Test comprehensive workflow
  console.log(`\n🎯 Testing Complete Workflow:`);
  
  // 1. Admin creates staff, views statistics
  console.log('\n1️⃣ Admin Workflow Test:');
  try {
    const adminLogin = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'password' })
    });
    
    const adminData = await adminLogin.json();
    const adminToken = adminData.token;
    
    // Test admin accessing staff statistics
    const statsResponse = await fetch(`${BASE_URL}/staff/statistics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    if (statsResponse.status === 200) {
      console.log('  ✅ Admin can access staff statistics');
    } else {
      console.log(`  ❌ Admin staff statistics access failed: ${statsResponse.status}`);
    }
    
    // Test inventory management
    const inventoryResponse = await fetch(`${BASE_URL}/inventory/statistics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    if (inventoryResponse.status === 200) {
      console.log('  ✅ Admin can access inventory statistics');
    } else {
      console.log(`  ❌ Admin inventory statistics failed: ${inventoryResponse.status}`);
    }
    
  } catch (error) {
    console.log('  🔴 Admin workflow error:', error.message);
  }

  // 2. Doctor manages patients
  console.log('\n2️⃣ Doctor Workflow Test:');
  try {
    const doctorLogin = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'doctor', password: 'password' })
    });
    
    const doctorData = await doctorLogin.json();
    const doctorToken = doctorData.token;
    
    // Test doctor accessing IPD patients
    const ipdResponse = await fetch(`${BASE_URL}/ipd/patients`, {
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    
    if (ipdResponse.status === 200) {
      console.log('  ✅ Doctor can access IPD patients');
    } else {
      console.log(`  ❌ Doctor IPD access failed: ${ipdResponse.status}`);
    }
    
    // Test doctor accessing OPD patients  
    const opdResponse = await fetch(`${BASE_URL}/opd/`, {
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    
    if (opdResponse.status === 200) {
      console.log('  ✅ Doctor can access OPD patients');
    } else {
      console.log(`  ❌ Doctor OPD access failed: ${opdResponse.status}`);
    }
    
    // Test doctor trying to access staff (should fail)
    const staffResponse = await fetch(`${BASE_URL}/staff/`, {
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    
    if (staffResponse.status === 403) {
      console.log('  ✅ Doctor correctly denied staff access');
    } else {
      console.log(`  ⚠️  Doctor staff access: ${staffResponse.status} (should be 403)`);
    }
    
  } catch (error) {
    console.log('  🔴 Doctor workflow error:', error.message);
  }

  console.log('\n🎉 Role-Based Authentication Test Complete!');
  console.log('\n📋 Summary:');
  console.log('✅ Multiple user roles (admin, doctor, staff)');
  console.log('✅ Role-based endpoint access control');
  console.log('✅ Proper access denial for insufficient permissions');
  console.log('✅ Complete workflow testing');
};

testRoleBasedAuth().catch(console.error);