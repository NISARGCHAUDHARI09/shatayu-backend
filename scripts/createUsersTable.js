// Create Users Table Script for Cloudflare D1
import { query as d1Query, execute as d1Execute } from '../config/d1-rest-client.js';

async function createUsersTable() {
  try {
    console.log('🔧 Creating users table in Cloudflare D1...');

    // Drop table if exists (for fresh setup)
    await d1Execute(`DROP TABLE IF EXISTS users`);
    console.log('🗑️ Dropped existing users table (if any)');

    // Create users table with comprehensive schema
    const createTableSQL = `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'staff', 'patient')),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        department TEXT,
        is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME
      )
    `;

    const result = await d1Execute(createTableSQL);
    
    if (result.success) {
      console.log('✅ Users table created successfully');
      
      // Create indexes for better performance
      await d1Execute('CREATE INDEX idx_users_email ON users(email)');
      await d1Execute('CREATE INDEX idx_users_username ON users(username)');
      await d1Execute('CREATE INDEX idx_users_role ON users(role)');
      await d1Execute('CREATE INDEX idx_users_is_active ON users(is_active)');
      await d1Execute('CREATE INDEX idx_users_deleted_at ON users(deleted_at)');
      console.log('✅ Database indexes created');

      // Create default admin user
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminResult = await d1Execute(`
        INSERT INTO users (username, email, password, role, first_name, last_name, department, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, ['admin', 'admin@hospital.com', hashedPassword, 'admin', 'System', 'Administrator', 'Administration', 1]);

      if (adminResult.success) {
        console.log('✅ Default admin user created');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   Email: admin@hospital.com');
      }

      console.log('\n🎉 Users table setup complete!');
      return true;
    } else {
      throw new Error('Failed to create users table');
    }
  } catch (error) {
    console.error('❌ Error creating users table:', error);
    return false;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createUsersTable()
    .then((success) => {
      if (success) {
        console.log('✅ Script completed successfully');
        process.exit(0);
      } else {
        console.log('❌ Script failed');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}

export default createUsersTable;