// backend/scripts/initPatientsTable.js
// Script to initialize the patients table
import { initDatabase as initDb, getDb, saveDatabase, testConnection } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initPatientsTable() {
  try {
    console.log('🔧 Initializing patients table...');
    
    // Initialize database
    await initDb();
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Cannot initialize database: connection failed');
      process.exit(1);
    }
    
    const db = await getDb();
    
    // Read patients.sql file
    const sqlFilePath = path.join(__dirname, '../DB/patients.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute SQL
    console.log('📝 Creating patients table...');
    db.exec(sqlContent);
    
    // Save database
    saveDatabase();
    
    console.log('✅ Patients table created successfully!');
    
    // Verify table exists
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='patients'");
    if (tables.length > 0 && tables[0].values.length > 0) {
      console.log('✅ Verified: patients table exists');
    } else {
      console.log('⚠️  Warning: patients table might not have been created');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing patients table:', error);
    process.exit(1);
  }
}

initPatientsTable();
