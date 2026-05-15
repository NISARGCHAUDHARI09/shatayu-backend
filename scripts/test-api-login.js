// Test doctor login via API
const testLogin = async () => {
  try {
    console.log('🧪 Testing Doctor Login API...\n');
    
    const response = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'himanshu@shatayu.com',
        password: 'Himanshu@123'
      })
    });
    
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📦 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.token) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
      console.log('🎫 Token received:', data.token.substring(0, 50) + '...');
      console.log('👤 User:', data.user);
    } else {
      console.log('\n❌ LOGIN FAILED');
      console.log('Error:', data.error || data.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testLogin();
