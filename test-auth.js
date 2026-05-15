// Test authentication with existing admin user
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5002';

async function testAuth() {
    console.log('🔐 Testing Authentication...\n');

    try {
        // Test login with correct admin credentials
        console.log('Attempting login with admin@email.com...');
        
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@email.com',
                password: 'Admin'
            })
        });

        const loginData = await loginResponse.json();
        
        console.log('Status:', loginResponse.status);
        console.log('Response:', loginData);

        if (loginResponse.ok && loginData.token) {
            console.log('✅ Login successful!');
            console.log('Token received:', loginData.token.substring(0, 20) + '...');
            
            // Test a protected endpoint
            console.log('\n📊 Testing protected endpoint (user statistics)...');
            
            const statsResponse = await fetch(`${BASE_URL}/api/users/statistics`, {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`
                }
            });

            const statsData = await statsResponse.json();
            console.log('Stats Status:', statsResponse.status);
            console.log('Stats Response:', statsData);

            if (statsResponse.ok) {
                console.log('✅ Authentication and protected endpoint working!');
                return loginData.token;
            } else {
                console.log('❌ Protected endpoint failed');
            }
        } else {
            console.log('❌ Login failed');
        }

    } catch (error) {
        console.error('❌ Error during test:', error.message);
    }
}

testAuth();