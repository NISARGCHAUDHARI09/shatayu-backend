// Test script to verify login API
// Run with: node test-login.js

const testLogin = async () => {
  console.log('🧪 Testing Login API...\n');

  try {
    const response = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@email.com',
        password: 'Admin'
      }),
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Login Test PASSED');
      console.log('🎫 Token received:', data.token ? 'Yes' : 'No');
      console.log('👤 User data:', data.user ? 'Yes' : 'No');
    } else {
      console.log('❌ Login Test FAILED');
      console.log('🚫 Error:', data.error);
    }
    
  } catch (error) {
    console.error('💥 Test Error:', error.message);
  }
};

// Run the test
testLogin();