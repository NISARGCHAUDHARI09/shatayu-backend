const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to your database
const dbPath = path.join(__dirname, 'DB', 'hospital.db');

console.log('Starting migration to make phone field optional...');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// SQLite doesn't support ALTER COLUMN directly, so we need to:
// 1. Create a new table with the updated schema
// 2. Copy data from old table
// 3. Drop old table
// 4. Rename new table

db.serialize(() => {
  // Create new table with phone as optional
  db.run(`
    CREATE TABLE IF NOT EXISTS patients_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      age INTEGER CHECK(age > 0),
      gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
      phone TEXT,
      email TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      postal_code TEXT,
      country TEXT DEFAULT 'India',
      date_of_birth DATE,
      blood_group TEXT,
      constitution TEXT,
      primary_treatment TEXT,
      patient_type TEXT CHECK(patient_type IN ('OPD', 'IPD')),
      status TEXT CHECK(status IN ('active', 'admitted', 'discharged')) DEFAULT 'active',
      last_visit DATE,
      next_appointment DATE,
      emergency_contact TEXT,
      medical_history TEXT,
      allergies TEXT,
      current_medication TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating new table:', err);
      process.exit(1);
    }
    console.log('✓ Created new table with updated schema');
  });

  // Copy data from old table to new table
  db.run(`
    INSERT INTO patients_new 
    SELECT * FROM patients
  `, (err) => {
    if (err) {
      console.error('Error copying data:', err);
      process.exit(1);
    }
    console.log('✓ Copied data from old table');
  });

  // Drop old table
  db.run(`DROP TABLE patients`, (err) => {
    if (err) {
      console.error('Error dropping old table:', err);
      process.exit(1);
    }
    console.log('✓ Dropped old table');
  });

  // Rename new table
  db.run(`ALTER TABLE patients_new RENAME TO patients`, (err) => {
    if (err) {
      console.error('Error renaming table:', err);
      process.exit(1);
    }
    console.log('✓ Renamed new table to patients');
  });

  // Recreate index
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_patients_search ON patients (name, patient_id, phone)
  `, (err) => {
    if (err) {
      console.error('Error creating index:', err);
      process.exit(1);
    }
    console.log('✓ Recreated search index');
    console.log('\n✅ Migration completed successfully!');
    console.log('Phone field is now optional.');
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      }
      process.exit(0);
    });
  });
});
