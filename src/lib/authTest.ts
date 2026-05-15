// Frontend Authentication Integration Test
import { apiClient } from '../lib/apiClient';

async function testFrontendAuth() {
  console.log('🔐 Testing Frontend Authentication Integration');
  console.log('=============================================\n');

  // Test 1: API Client Login
  console.log('1️⃣ Testing API Client Login:');
  try {
    const loginResult = await apiClient.login({ 
      email: 'doctor@hospital.com', 
      password: 'password' 
    });
    
    if (loginResult.success) {
      console.log('✅ API Client login successful');
      console.log('📄 User info:', loginResult.user);
      
      // Test 2: Authenticated API Call
      console.log('\n2️⃣ Testing Authenticated API Calls:');
      
      try {
        const ipdPatients = await apiClient.getIPDPatients(1, 5);
        console.log('✅ IPD Patients API call successful');
        console.log('📊 Data received:', ipdPatients.success ? 'Yes' : 'No');
        
        const opdPatients = await apiClient.getOPDPatients(1, 5);
        console.log('✅ OPD Patients API call successful');
        console.log('📊 Data received:', opdPatients.success ? 'Yes' : 'No');
        
      } catch (apiError) {
        console.log('❌ API call failed:', apiError instanceof Error ? apiError.message : 'Unknown error');
      }
      
    } else {
      console.log('❌ API Client login failed:', loginResult.error);
    }
  } catch (error) {
    console.log('🔴 Login test error:', error instanceof Error ? error.message : 'Unknown error');
  }

  // Test 3: Token Management
  console.log('\n3️⃣ Testing Token Management:');
  const token = localStorage.getItem('authToken');
  if (token) {
    console.log('✅ JWT token stored in localStorage');
    console.log('🔑 Token preview:', token.substring(0, 20) + '...');
  } else {
    console.log('❌ No token found in localStorage');
  }
  
  console.log('\n🎯 Frontend Authentication Integration Test Complete!');
}

// Export for use in browser console
declare global {
  interface Window {
    testFrontendAuth: () => Promise<void>;
  }
}

if (typeof window !== 'undefined') {
  window.testFrontendAuth = testFrontendAuth;
}

export { testFrontendAuth };