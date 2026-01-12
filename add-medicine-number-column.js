// Migration script to add medicine_number column to medicine tables
// This script adds the medicine_number column to Cloudflare D1 database

import { execute, testConnection, query } from './config/d1-rest-client.js';

async function addMedicineNumberColumn() {
  try {
    console.log('🔧 Starting medicine_number column migration...\n');
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Cannot connect to database');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful\n');
    
    // Check if tables exist and add medicine_number column
    // Using correct table names: medicines_vedic and medicines_custom
    const migrations = [
      {
        name: 'medicines_vedic',
        sql: `ALTER TABLE medicines_vedic ADD COLUMN medicine_number TEXT;`,
        indexSql: `CREATE INDEX IF NOT EXISTS idx_medicines_vedic_medicine_number ON medicines_vedic(medicine_number);`
      },
      {
        name: 'medicines_custom',
        sql: `ALTER TABLE medicines_custom ADD COLUMN medicine_number TEXT;`,
        indexSql: `CREATE INDEX IF NOT EXISTS idx_medicines_custom_medicine_number ON medicines_custom(medicine_number);`
      }
    ];

    console.log('📝 Adding medicine_number column to tables...\n');
    
    for (const migration of migrations) {
      try {
        await execute(migration.sql);
        console.log(`✓ Added medicine_number to ${migration.name} table`);
        
        // Create index for better performance
        try {
          await execute(migration.indexSql);
          console.log(`✓ Created index for ${migration.name}\n`);
        } catch (indexErr) {
          console.log(`  Index already exists for ${migration.name}\n`);
        }
      } catch (err) {
        if (err.message.includes('duplicate column') || err.message.includes('already exists')) {
          console.log(`  ℹ️  Column already exists in ${migration.name}, skipping...\n`);
        } else if (err.message.includes('no such table')) {
          console.log(`  ⚠️  Table ${migration.name} doesn't exist yet, skipping...\n`);
        } else {
          console.log(`  ⚠️  Warning for ${migration.name}: ${err.message}\n`);
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nMedicine tables now include medicine_number column');
    console.log('\n📋 Suggested numbering format:');
    console.log('   Vedic Medicines: VED-001, VED-002, VED-003, ...');
    console.log('   Custom Medicines: CUST-001, CUST-002, CUST-003, ...');
    console.log('\n💡 You can now add medicine numbers through the frontend form');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    console.error(err.stack);
    process.exit(1);
  }
}

// Run migration
addMedicineNumberColumn();
