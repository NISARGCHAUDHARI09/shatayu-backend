// backend/scripts/initDatabase.js
// Script to initialize the medicine bills and draft bills tables for Cloudflare D1 / SQLite
import { initDatabase as initDb, getDb, saveDatabase, testConnection } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  try {
    console.log('🔧 Initializing Cloudflare D1 / SQLite database...');
    
    // Initialize database
    await initDb();
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Cannot initialize database: connection failed');
      process.exit(1);
    }
    
    const db = await getDb();
    
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
    
    db.exec(medicineBillsSQL);
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
    
    db.exec(draftBillsSQL);
    console.log('✅ draft_bills table created');
    
    // Create users table for authentication
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
    
    db.exec(usersSQL);
    console.log('✅ users table created');
    
    // Save database to file
    saveDatabase();
    
    console.log('\n✅ Database initialization complete!');
    console.log('   Tables created:');
    console.log('   - medicine_bills');
    console.log('   - draft_bills');
    console.log('   - users');
    console.log('\n💡 Next step: Run "npm run create-admin" to create your first admin user');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

initDatabase();
