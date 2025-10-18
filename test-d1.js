// Simple D1 Database Test
import { initDatabase, query, execute } from './config/d1-rest-client.js';

async function testD1Connection() {
    console.log('🧪 Testing D1 Database Connection...\n');

    try {
        // Initialize database
        await initDatabase();
        console.log('✅ Database initialized\n');

        // Test simple query
        console.log('🔍 Testing simple query...');
        const result = await query('SELECT 1 as test');
        console.log('Simple query result:', result);
        console.log('');

        // Test users table existence
        console.log('👥 Testing users table...');
        const usersResult = await query('SELECT name FROM sqlite_master WHERE type="table" AND name="users"');
        console.log('Users table check:', usersResult);
        console.log('Users result type:', typeof usersResult);
        console.log('Users result length:', usersResult?.length);
        console.log('');

        // Try to query users regardless
        console.log('📋 Testing users query...');
        try {
            const users = await query('SELECT * FROM users LIMIT 5');
            console.log('Users query result:', users);
            console.log('Users type:', typeof users);
            console.log('Users length:', users?.length);
            
            // Check user table schema
            console.log('\n🔧 Checking users table schema...');
            const schema = await query('PRAGMA table_info(users)');
            console.log('Users table schema:', schema);
        } catch (error) {
            console.log('❌ Users query failed:', error.message);
        }

    } catch (error) {
        console.error('❌ D1 test failed:', error.message);
        console.error('Error details:', error);
    }
}

testD1Connection();