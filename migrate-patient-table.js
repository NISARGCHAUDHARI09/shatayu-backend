// Migration script to add new columns to patients table
// Run this ONCE before deploying to Render

const db = require('./modules');

async function migratePatientTable() {
  try {
    console.log('Starting patient table migration...');
    
    // Add new columns if they don't exist
    const migrations = [
      `ALTER TABLE patients ADD COLUMN state TEXT;`,
      `ALTER TABLE patients ADD COLUMN date_of_birth DATE;`,
      `ALTER TABLE patients ADD COLUMN blood_group TEXT;`,
      `ALTER TABLE patients ADD COLUMN medical_history TEXT;`,
      `ALTER TABLE patients ADD COLUMN allergies TEXT;`,
      `ALTER TABLE patients ADD COLUMN current_medication TEXT;`
    ];

    for (const migration of migrations) {
      try {
        await db.sequelize.query(migration);
        console.log(`✓ Executed: ${migration}`);
      } catch (err) {
        // Column might already exist, that's okay
        if (err.message.includes('duplicate column name')) {
          console.log(`  Column already exists, skipping...`);
        } else {
          console.log(`  Warning: ${err.message}`);
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nPatient table now includes:');
    console.log('  - state');
    console.log('  - date_of_birth');
    console.log('  - blood_group');
    console.log('  - medical_history');
    console.log('  - allergies');
    console.log('  - current_medication');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

// Run migration
migratePatientTable();
