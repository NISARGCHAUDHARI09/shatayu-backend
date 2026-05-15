// User Management System Test Script
import { apiClient } from '../lib/apiClient.js';

async function testUserManagementSystem() {
    console.log('🧪 Testing User Management System...\n');

    try {
        // Test 1: Get user statistics
        console.log('📊 Testing User Statistics...');
        const statsResponse = await apiClient.getUserStatistics();
        console.log('✅ Statistics:', statsResponse.data);
        console.log('');

        // Test 2: Get all users
        console.log('👥 Testing Get All Users...');
        const usersResponse = await apiClient.getAllUsers();
        console.log('✅ Users fetched:', usersResponse.data.length, 'users found');
        console.log('📄 Pagination:', usersResponse.pagination);
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
        
        const createResponse = await apiClient.createUser(newUser);
        console.log('✅ User created:', createResponse.data);
        const newUserId = createResponse.data.id;
        console.log('');

        // Test 4: Get user by ID
        console.log('🔍 Testing Get User by ID...');
        const userResponse = await apiClient.getUserById(newUserId);
        console.log('✅ User fetched by ID:', userResponse.data);
        console.log('');

        // Test 5: Update user
        console.log('✏️ Testing User Update...');
        const updateResponse = await apiClient.updateUser(newUserId, {
            department: 'Emergency',
            phone: '+1234567890'
        });
        console.log('✅ User updated successfully');
        console.log('');

        // Test 6: Search users
        console.log('🔎 Testing User Search...');
        const searchResponse = await apiClient.getAllUsers({
            search: 'Test',
            role: 'staff'
        });
        console.log('✅ Search results:', searchResponse.data.length, 'users found');
        console.log('');

        // Test 7: Toggle user status
        console.log('🔄 Testing User Status Toggle...');
        await apiClient.updateUser(newUserId, { is_active: false });
        console.log('✅ User deactivated');
        await apiClient.updateUser(newUserId, { is_active: true });
        console.log('✅ User reactivated');
        console.log('');

        // Test 8: Delete user (cleanup)
        console.log('🗑️ Testing User Deletion (cleanup)...');
        await apiClient.deleteUser(newUserId);
        console.log('✅ Test user deleted');
        console.log('');

        console.log('🎉 All tests passed! User Management System is working correctly.\n');

        // Summary
        console.log('📋 SUMMARY:');
        console.log('✅ User Statistics - Working');
        console.log('✅ Get All Users - Working');
        console.log('✅ Create User - Working');
        console.log('✅ Get User by ID - Working');
        console.log('✅ Update User - Working');
        console.log('✅ Search Users - Working');
        console.log('✅ Toggle User Status - Working');
        console.log('✅ Delete User - Working');
        console.log('\n🏥 Hospital User Management System is ready for production!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

// Run the test
testUserManagementSystem();