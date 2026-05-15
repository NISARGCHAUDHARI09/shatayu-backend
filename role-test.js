// Test JWT with Admin Role
import jwt from 'jsonwebtoken';

console.log('🔐 Testing JWT with Admin Role');
console.log('===============================\n');

const BASE_URL = 'http://localhost:5002/api';

const testAdminAccess = async () => {
  // Create admin token manually using the same JWT_SECRET
  console.log('🔑 Testing with simulated admin token:');
  const JWT_SECRET = process.env.JWT_SECRET || 'hospital-management-secret-key-2024';
  
  // Create admin user token
  const adminUser = { 
    id: 1, 
    username: 'admin', 
    email: 'admin@hospital.com',
    role: 'admin'
  };
  
  const adminToken = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '2h' });
  console.log('✅ Admin token generated');
  
  // Test admin endpoints
  const endpoints = [
    { method: 'GET', url: `${BASE_URL}/staff/`, name: 'Staff List (Admin only)' },
    { method: 'GET', url: `${BASE_URL}/inventory/statistics`, name: 'Inventory Stats (Admin only)' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      const status = response.status;
      
      if (status === 200) {
        console.log(`✅ ${endpoint.name}: Admin access granted (200)`);
      } else if (status === 403) {
        console.log(`❌ ${endpoint.name}: Admin access still forbidden (403)`);
      } else {
        console.log(`⚠️  ${endpoint.name}: Unexpected status: ${status}`);
      }
    } catch (error) {
      console.log(`🔴 ${endpoint.name}: Network error - ${error.message}`);
    }
  }
  
  // Create doctor user token
  const doctorUser = { 
    id: 2, 
    username: 'doctor', 
    email: 'doctor@hospital.com',
    role: 'doctor'
  };
  
  const doctorToken = jwt.sign(doctorUser, JWT_SECRET, { expiresIn: '2h' });
  console.log('\n🩺 Testing with doctor token:');
  
  // Test doctor endpoints
  const doctorEndpoints = [
    { method: 'GET', url: `${BASE_URL}/ipd/patients`, name: 'IPD Patients (Doctor/Admin)' },
    { method: 'GET', url: `${BASE_URL}/opd/`, name: 'OPD Patients (Doctor/Admin)' }
  ];

  for (const endpoint of doctorEndpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${doctorToken}`
        }
      });
      
      const status = response.status;
      
      if (status === 200) {
        console.log(`✅ ${endpoint.name}: Doctor access granted (200)`);
      } else if (status === 403) {
        console.log(`❌ ${endpoint.name}: Doctor access forbidden (403)`);
      } else {
        console.log(`⚠️  ${endpoint.name}: Unexpected status: ${status}`);
      }
    } catch (error) {
      console.log(`🔴 ${endpoint.name}: Network error - ${error.message}`);
    }
  }
};

testAdminAccess();