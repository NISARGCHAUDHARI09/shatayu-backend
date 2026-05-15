import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import readline from 'readline';
import { initDatabase, getDb, saveDatabase } from '../config/database.js';

dotenv.config();

// Setup command line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function createAdminUser() {
  console.log('🔧 Create Admin User\n');
  
  // Initialize database
  await initDatabase();
  const db = await getDb();
  
  rl.question('Enter admin username: ', (username) => {
    rl.question('Enter admin email: ', (email) => {
      rl.question('Enter admin name: ', (name) => {
        rl.question('Enter password: ', async (password) => {
          try {
            const hash = await bcrypt.hash(password, 10);

            db.run(
              'INSERT INTO users (username, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
              [username, email, hash, name, 'admin']
            );
            
            saveDatabase();

            console.log('\n✅ Admin user created successfully!');
            console.log(`   Username: ${username}`);
            console.log(`   Email: ${email}`);
            console.log(`   Role: admin`);
            console.log('\n💡 You can now login with these credentials at http://localhost:5173/login');
          } catch (err) {
            console.error('❌ Error creating admin user:', err.message);
          } finally {
            rl.close();
            process.exit(0);
          }
        });
      });
    });
  });
}

createAdminUser();
