import { execute as d1Execute } from '../config/d1-rest-client.js';

async function createBillingTable() {
  try {
    // Create billing table
    await d1Execute(`
      CREATE TABLE IF NOT EXISTS billing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoiceId TEXT UNIQUE NOT NULL,
        patientName TEXT NOT NULL,
        patientId TEXT,
        date TEXT NOT NULL,
        services TEXT NOT NULL,
        amount INTEGER NOT NULL,
        paid INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Pending',
        paymentMethod TEXT,
        phone TEXT,
        dueDate TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
    
    console.log('✅ Billing table created successfully');
    
  } catch (error) {
    console.error('❌ Error creating billing table:', error);
    throw error;
  }
}

// Run the script
createBillingTable()
  .then(() => {
    console.log('Billing table setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create billing table:', error);
    process.exit(1);
  });

export { createBillingTable };
