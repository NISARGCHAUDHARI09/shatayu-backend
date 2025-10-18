// Test User Management CRUD Operations
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5002';

async function testUserManagementCRUD() {
    console.log('🧪 Testing User Management CRUD Operations...\n');

    try {
        // Step 1: Login to get token
        console.log('🔐 Step 1: Login...');
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

        // Step 2: Test Get All Users
        console.log('👥 Step 2: Get All Users...');
        const usersResponse = await fetch(`${BASE_URL}/api/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const usersData = await usersResponse.json();
        console.log('Status:', usersResponse.status);
        console.log('Response:', usersData);
        console.log('');

        // Step 3: Test User Statistics (simplified)
        console.log('📊 Step 3: Test User Statistics...');
        try {
            const statsResponse = await fetch(`${BASE_URL}/api/users/statistics`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statsData = await statsResponse.json();
            console.log('Stats Status:', statsResponse.status);
            console.log('Stats Response:', statsData);
        } catch (error) {
            console.log('❌ Statistics error:', error.message);
        }
        console.log('');

        // Step 4: Test Create User
        console.log('➕ Step 4: Create New User...');
        const newUser = {
            username: 'testuser_' + Date.now(),
            email: `test${Date.now()}@example.com`,
            password: 'TestPassword123',
            role: 'staff',
            first_name: 'Test',
            last_name: 'User',
            department: 'Administration'
        };

        const createResponse = await fetch(`${BASE_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newUser)
        });

        const createData = await createResponse.json();
        console.log('Create Status:', createResponse.status);
        console.log('Create Response:', createData);

        if (createResponse.ok && createData.data) {
            const newUserId = createData.data.id;
            console.log('✅ User created with ID:', newUserId);

            // Step 5: Test Get User by ID
            console.log('\n🔍 Step 5: Get User by ID...');
            const userResponse = await fetch(`${BASE_URL}/api/users/${newUserId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = await userResponse.json();
            console.log('Get User Status:', userResponse.status);
            console.log('Get User Response:', userData);

            // Step 6: Test Update User
            console.log('\n✏️ Step 6: Update User...');
            const updateResponse = await fetch(`${BASE_URL}/api/users/${newUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    department: 'Emergency',
                    phone: '+1234567890'
                })
            });
            const updateData = await updateResponse.json();
            console.log('Update Status:', updateResponse.status);
            console.log('Update Response:', updateData);

            // Step 7: Test Delete User
            console.log('\n🗑️ Step 7: Delete User (cleanup)...');
            const deleteResponse = await fetch(`${BASE_URL}/api/users/${newUserId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const deleteData = await deleteResponse.json();
            console.log('Delete Status:', deleteResponse.status);
            console.log('Delete Response:', deleteData);
        }

        console.log('\n🎉 User Management CRUD Testing Complete!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testUserManagementCRUD();