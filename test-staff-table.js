// Simple D1 connection and staff table test
import { execute, queryOne, query } from './config/d1-rest-client.js';

async function testStaffTable() {
    try {
        console.log('🔍 Testing D1 connection and staff table...');
        
        // Test basic connection
        console.log('1. Testing basic D1 connection...');
        const testQuery = await queryOne("SELECT 1 as test");
        console.log('✅ D1 connection working:', testQuery);
        
        // Check if staff table exists
        console.log('2. Checking if staff table exists...');
        const tableExists = await queryOne("SELECT name FROM sqlite_master WHERE type='table' AND name='staff'");
        console.log('Staff table exists:', tableExists ? '✅ YES' : '❌ NO');
        
        if (!tableExists) {
            console.log('📝 Creating staff table...');
            
            const createTableSQL = `
            CREATE TABLE IF NOT EXISTS staff (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT NOT NULL,
                position TEXT NOT NULL,
                department TEXT NOT NULL,
                join_date TEXT NOT NULL,
                salary REAL,
                status TEXT DEFAULT 'Active',
                address TEXT,
                experience TEXT,
                qualification TEXT,
                emergency_contact TEXT,
                blood_group TEXT,
                working_hours TEXT,
                performance INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );`;
            
            await execute(createTableSQL);
            console.log('✅ Staff table created!');
        }
        
        // Test staff query
        console.log('3. Testing staff query...');
        const staffCount = await queryOne('SELECT COUNT(*) as count FROM staff');
        console.log('Staff records count:', staffCount);
        
        // Try to get all staff (same query as controller)
        console.log('4. Testing getAllStaff query...');
        const staffRecords = await query('SELECT * FROM staff WHERE 1=1 ORDER BY name ASC LIMIT 10 OFFSET 0');
        console.log('Staff records:', staffRecords);
        
        console.log('✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Error in staff table test:', error);
        console.error('Full error:', error.message);
        console.error('Stack:', error.stack);
    }
}

testStaffTable();