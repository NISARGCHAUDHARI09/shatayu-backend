// Simple User Management Backend Test
import http from 'http';

const BASE_URL = 'http://localhost:5002';

function makeRequest(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        };

        const req = http.request(url, options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testUserManagement() {
    console.log('🧪 Testing User Management Backend...\n');

    try {
        // First, let's test login to get a token
        console.log('🔐 Testing Login...');
        const loginResponse = await makeRequest('POST', '/api/users/login', {
            username: 'admin',
            password: 'admin123'
        });

        if (loginResponse.status !== 200) {
            console.log('❌ Login failed:', loginResponse.data);
            return;
        }

        const token = loginResponse.data.token;
        console.log('✅ Login successful, token received');
        console.log('');

        // Test 1: Get user statistics
        console.log('📊 Testing User Statistics...');
        const statsResponse = await makeRequest('GET', '/api/users/statistics', null, token);
        console.log('Status:', statsResponse.status);
        console.log('✅ Statistics:', statsResponse.data);
        console.log('');

        // Test 2: Get all users
        console.log('👥 Testing Get All Users...');
        const usersResponse = await makeRequest('GET', '/api/users', null, token);
        console.log('Status:', usersResponse.status);
        console.log('✅ Users response:', usersResponse.data);
        console.log('');

        // Test 3: Create a test user
        console.log('➕ Testing User Creation...');
        const newUser = {
            username: 'testuser_' + Date.now(),
            email: `test${Date.now()}@hospital.com`,
            password: 'testpassword123',
            role: 'staff',
            first_name: 'Test',
            last_name: 'User',
            department: 'Administration'
        };
        
        const createResponse = await makeRequest('POST', '/api/users', newUser, token);
        console.log('Status:', createResponse.status);
        console.log('✅ User creation response:', createResponse.data);
        
        if (createResponse.status === 201 && createResponse.data.data) {
            const newUserId = createResponse.data.data.id;
            console.log('New user ID:', newUserId);
            
            // Test 4: Get user by ID
            console.log('\n🔍 Testing Get User by ID...');
            const userResponse = await makeRequest('GET', `/api/users/${newUserId}`, null, token);
            console.log('Status:', userResponse.status);
            console.log('✅ User by ID response:', userResponse.data);
            
            // Test 5: Update user
            console.log('\n✏️ Testing User Update...');
            const updateResponse = await makeRequest('PUT', `/api/users/${newUserId}`, {
                department: 'Emergency',
                phone: '+1234567890'
            }, token);
            console.log('Status:', updateResponse.status);
            console.log('✅ User update response:', updateResponse.data);
            
            // Test 6: Delete user (cleanup)
            console.log('\n🗑️ Testing User Deletion...');
            const deleteResponse = await makeRequest('DELETE', `/api/users/${newUserId}`, null, token);
            console.log('Status:', deleteResponse.status);
            console.log('✅ User deletion response:', deleteResponse.data);
        }

        console.log('\n🎉 Backend testing completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testUserManagement();