// backend/scripts/initCloudflareD1.js
// Script to initialize tables in Cloudflare D1 database using REST API
import { initDatabase, testConnection, execute } from '../config/d1-rest-client.js';

async function initCloudflareD1() {
  try {
    console.log('🔧 Initializing Cloudflare D1 database...\n');
    
    // Initialize database
    await initDatabase();
    
    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Cannot initialize database: connection failed');
      process.exit(1);
    }
    
    console.log('\n📝 Creating tables...\n');
    
    // Create users table
    const usersSQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'doctor', 'patient', 'staff')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
    
    await execute(usersSQL);
    console.log('✅ users table created');
    
    // Create medicine_bills table
    const medicineBillsSQL = `
CREATE TABLE IF NOT EXISTS medicine_bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT,
    patient_name TEXT NOT NULL,
    patient_age INTEGER,
    patient_gender TEXT,
    case_id TEXT,
    doctor_id INTEGER,
    doctor_name TEXT,
    medicines_json TEXT,
    status TEXT DEFAULT 'finalized',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    finalized_at DATETIME,
    total_amount REAL DEFAULT 0.0,
    discount REAL DEFAULT 0.0,
    final_total REAL DEFAULT 0.0,
    reminder_date TEXT
);
`;
    
    await execute(medicineBillsSQL);
    console.log('✅ medicine_bills table created');
    
    // Create draft_bills table
    const draftBillsSQL = `
CREATE TABLE IF NOT EXISTS draft_bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT,
    patient_name TEXT NOT NULL,
    patient_age INTEGER,
    patient_gender TEXT,
    case_id TEXT,
    doctor_id INTEGER,
    doctor_name TEXT,
    medicines_json TEXT,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    finalized_at DATETIME,
    total_amount REAL DEFAULT 0.0,
    discount REAL DEFAULT 0.0,
    final_total REAL DEFAULT 0.0,
    reminder_date TEXT
);
`;
    
    await execute(draftBillsSQL);
    console.log('✅ draft_bills table created');
    
    console.log('\n✅ Cloudflare D1 database initialization complete!');
    console.log('   Tables created:');
    console.log('   - users');
    console.log('   - medicine_bills');
    console.log('   - draft_bills');
    console.log('\n💡 Next step: Run "npm run create-admin-d1" to create your first admin user in Cloudflare D1');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

initCloudflareD1();
