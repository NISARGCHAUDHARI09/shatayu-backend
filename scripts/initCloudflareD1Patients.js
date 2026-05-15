// backend/scripts/initCloudflareD1Patients.js
// Script to initialize patients table in Cloudflare D1
import { queryD1, testConnection } from '../config/d1-rest-client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initCloudflareD1Patients() {
  try {
    console.log('🔧 Initializing patients table in Cloudflare D1...');
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Cannot initialize: Cloudflare D1 connection failed');
      process.exit(1);
    }
    
    // Read patients.sql file
    const sqlFilePath = path.join(__dirname, '../DB/patients.sql');
    let sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Remove comments and split by semicolon
    sqlContent = sqlContent
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`\n[${i + 1}/${statements.length}] Executing:`, stmt.substring(0, 50) + '...');
      
      try {
        const result = await queryD1(stmt);
        console.log(`✅ Success:`, result.meta);
      } catch (error) {
        // Ignore "table already exists" errors
        if (error.message && error.message.includes('already exists')) {
          console.log(`⚠️  Table already exists (skipping)`);
        } else {
          console.error(`❌ Error:`, error.message);
          throw error;
        }
      }
    }
    
    // Verify table exists
    console.log('\n🔍 Verifying patients table...');
    const tables = await queryD1("SELECT name FROM sqlite_master WHERE type='table' AND name='patients'");
    
    if (tables.results && tables.results.length > 0) {
      console.log('✅ Patients table exists in Cloudflare D1!');
      
      // Check table structure
      const columns = await queryD1("PRAGMA table_info(patients)");
      console.log(`\n📊 Table has ${columns.results.length} columns:`);
      columns.results.forEach(col => {
        console.log(`   • ${col.name} (${col.type}${col.notnull ? ' NOT NULL' : ''})`);
      });
    } else {
      console.log('⚠️  Warning: patients table might not have been created');
    }
    
    console.log('\n✅ Cloudflare D1 patients table initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error initializing Cloudflare D1 patients table:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

initCloudflareD1Patients();
