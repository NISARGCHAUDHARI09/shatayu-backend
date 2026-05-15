// backend/scripts/createAdminD1.js
// Script to create an admin user in Cloudflare D1 database using REST API
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import readline from 'readline';
import { initDatabase, execute } from '../config/d1-rest-client.js';

dotenv.config();

// Setup command line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function createAdminUser() {
  console.log('🔧 Create Admin User in Cloudflare D1\n');
  
  try {
    // Initialize database
    await initDatabase();
    console.log('✅ Connected to Cloudflare D1\n');
    
    rl.question('Enter admin username: ', (username) => {
      rl.question('Enter admin email: ', (email) => {
        rl.question('Enter admin name: ', (name) => {
          rl.question('Enter password: ', async (password) => {
            try {
              const hash = await bcrypt.hash(password, 10);

              await execute(
                'INSERT INTO users (username, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
                [username, email, hash, name, 'admin']
              );

              console.log('\n✅ Admin user created successfully in Cloudflare D1!');
              console.log(`   Username: ${username}`);
              console.log(`   Email: ${email}`);
              console.log(`   Role: admin`);
              console.log('\n💡 You can now login with these credentials');
            } catch (err) {
              console.error('❌ Error creating admin user:', err.message);
              if (err.message.includes('UNIQUE')) {
                console.error('   This email or username already exists.');
              }
            } finally {
              rl.close();
              process.exit(0);
            }
          });
        });
      });
    });
  } catch (error) {
    console.error('❌ Failed to connect to Cloudflare D1:', error.message);
    console.error('\nMake sure you have set the following environment variables:');
    console.error('  - D1_DATABASE_URL');
    console.error('  - D1_AUTH_TOKEN');
    rl.close();
    process.exit(1);
  }
}

createAdminUser();
