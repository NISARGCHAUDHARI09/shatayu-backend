// Staff Table Creation Script for Cloudflare D1
// Converts MySQL staff.sql to SQLite/D1 compatible format

import { execute, queryOne } from './config/d1-rest-client.js';

const createStaffTable = async () => {
    console.log('🏗️  Creating staff table in Cloudflare D1...');
    
    try {
        // Drop existing table if needed (optional - remove this in production)
        console.log('🗑️  Checking if staff table exists...');
        
        // SQLite/D1 compatible staff table schema
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
            status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Inactive')),
            avatar TEXT,
            address TEXT,
            experience TEXT,
            qualification TEXT,
            emergency_contact TEXT,
            blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
            working_hours TEXT,
            performance INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );`;

        // Execute table creation
        console.log('📊 Creating staff table...');
        await execute(createTableSQL);
        console.log('✅ Staff table created successfully!');

        // Verify table creation
        console.log('🔍 Verifying table creation...');
        const verification = await queryOne("SELECT name FROM sqlite_master WHERE type='table' AND name='staff'");
        
        if (verification) {
            console.log('✅ Staff table verified in database!');
            
            // Check if table has any data
            const count = await queryOne('SELECT COUNT(*) as count FROM staff');
            console.log(`📊 Current staff records: ${count.count}`);
            
            // Insert sample staff member if table is empty
            if (count.count === 0) {
                console.log('📝 Inserting sample staff data...');
                
                const sampleStaff = {
                    employee_id: 'EMP001',
                    name: 'Dr. Rajesh Kumar',
                    email: 'rajesh.kumar@hospital.com',
                    phone: '+91 9876543210',
                    position: 'Senior Doctor',
                    department: 'Cardiology',
                    join_date: '2020-01-15',
                    salary: 75000,
                    status: 'Active',
                    address: '123 Medical Street, New Delhi',
                    experience: '8 years',
                    qualification: 'MBBS, MD Cardiology',
                    emergency_contact: '+91 9876543211',
                    blood_group: 'O+',
                    working_hours: '9:00 AM - 6:00 PM',
                    performance: 95
                };

                await execute(
                    `INSERT INTO staff (
                        employee_id, name, email, phone, position, department, 
                        join_date, salary, status, address, experience, 
                        qualification, emergency_contact, blood_group, working_hours, performance
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        sampleStaff.employee_id, sampleStaff.name, sampleStaff.email, 
                        sampleStaff.phone, sampleStaff.position, sampleStaff.department,
                        sampleStaff.join_date, sampleStaff.salary, sampleStaff.status, 
                        sampleStaff.address, sampleStaff.experience, sampleStaff.qualification,
                        sampleStaff.emergency_contact, sampleStaff.blood_group, 
                        sampleStaff.working_hours, sampleStaff.performance
                    ]
                );
                
                console.log('✅ Sample staff member added successfully!');
                
                // Verify insertion
                const newCount = await queryOne('SELECT COUNT(*) as count FROM staff');
                console.log(`📊 Staff records after sample insertion: ${newCount.count}`);
            }
            
        } else {
            console.log('❌ Table creation verification failed');
            return false;
        }

        return true;

    } catch (error) {
        console.error('❌ Error creating staff table:', error);
        console.error('Error details:', error.message);
        return false;
    }
};

// Main execution
const main = async () => {
    console.log('🚀 Starting staff table setup for Hospital Management System');
    console.log('=' .repeat(60));
    
    const success = await createStaffTable();
    
    console.log('=' .repeat(60));
    if (success) {
        console.log('🎉 Staff table setup completed successfully!');
        console.log('✅ Staff controller should now work properly');
        console.log('🧪 You can now test: GET http://localhost:5002/api/staff/');
    } else {
        console.log('❌ Staff table setup failed');
        console.log('🔧 Please check the error messages above');
    }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { createStaffTable };