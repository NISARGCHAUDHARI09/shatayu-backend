import { execute as d1Execute, query as d1Query } from '../config/d1-rest-client.js';
import bcrypt from 'bcrypt';
import readline from 'readline';

const SALT_ROUNDS = 10;

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisified question function
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createDoctorUser() {
  try {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║     CREATE DOCTOR LOGIN CREDENTIALS                ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    // Get doctor details from user
    const email = await question('📧 Enter Email: ');
    
    // Check if user already exists
    const existingUser = await d1Query(`
      SELECT * FROM users WHERE email = ?
    `, [email]);

    if (existingUser && existingUser.length > 0) {
      console.log('\n⚠️  User with this email already exists!');
      console.log(`📧 Email: ${email}`);
      rl.close();
      return;
    }

    const password = await question('🔑 Enter Password: ');
    const firstName = await question('👤 Enter First Name: ');
    const lastName = await question('👤 Enter Last Name: ');
    const phone = await question('📱 Enter Phone Number: ');
    const department = await question('🏥 Enter Department (e.g., Ayurveda, Cardiology): ');
    
    const fullName = `${firstName} ${lastName}`;
    const username = email.split('@')[0]; // Use email prefix as username

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create doctor user
    await d1Execute(`
      INSERT INTO users (
        username, 
        email, 
        password, 
        name,
        role, 
        first_name, 
        last_name, 
        phone, 
        department, 
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      username,
      email,
      hashedPassword,
      fullName,
      'doctor',
      firstName,
      lastName,
      phone,
      department,
      1
    ]);

    console.log('\n✅ Doctor user created successfully!');
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║           DOCTOR LOGIN CREDENTIALS                 ║');
    console.log('╠════════════════════════════════════════════════════╣');
    console.log(`║ 📧 Email:      ${email.padEnd(36)} ║`);
    console.log(`║ 🔑 Password:   ${password.padEnd(36)} ║`);
    console.log(`║ 👤 Name:       ${fullName.padEnd(36)} ║`);
    console.log(`║ 🏥 Department: ${department.padEnd(36)} ║`);
    console.log(`║ 📱 Phone:      ${phone.padEnd(36)} ║`);
    console.log('╚════════════════════════════════════════════════════╝\n');
    console.log('⚠️  IMPORTANT: Please save these credentials securely!');
    console.log('📋 Share these credentials with your client.\n');

    rl.close();

  } catch (error) {
    console.error('❌ Error creating doctor user:', error);
    rl.close();
    throw error;
  }
}

// Run the script
createDoctorUser()
  .then(() => {
    console.log('Doctor credential setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create doctor user:', error);
    process.exit(1);
  });
