// Debug User Management Endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5002';

async function debugEndpoints() {
    console.log('🔍 Debugging User Management Endpoints...\n');

    try {
        // Step 1: Login
        console.log('🔐 Login...');
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@email.com',
                password: 'Admin'
            })
        });

        const loginData = await loginResponse.json();
        if (!loginResponse.ok || !loginData.token) {
            console.log('❌ Login failed:', loginData);
            return;
        }

        const token = loginData.token;
        console.log('✅ Login successful\n');

        // Step 2: Test Health Check
        console.log('🏥 Health Check...');
        const healthResponse = await fetch(`${BASE_URL}/api/health`);
        const healthData = await healthResponse.json();
        console.log('Health Status:', healthResponse.status);
        console.log('Health Response:', healthData);
        console.log('');

        // Step 3: Raw Request to Users endpoint
        console.log('👥 Raw Users Request...');
        try {
            const response = await fetch(`${BASE_URL}/api/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            console.log('Users Status:', response.status);
            console.log('Users Headers:', Object.fromEntries(response.headers.entries()));
            
            const text = await response.text();
            console.log('Raw Users Response (first 500 chars):');
            console.log(text.substring(0, 500));
            
            if (text.startsWith('{') || text.startsWith('[')) {
                try {
                    const json = JSON.parse(text);
                    console.log('Parsed JSON:', json);
                } catch (e) {
                    console.log('❌ Failed to parse as JSON');
                }
            }
        } catch (error) {
            console.log('❌ Users request error:', error.message);
        }

    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
}

debugEndpoints();