import bcrypt from 'bcrypt';
import { query as d1Query } from '../config/d1-rest-client.js';

async function testDoctorLogin() {
  try {
    console.log('\n🔐 Testing Doctor Login Credentials...\n');
    
    const email = 'himanshu@shatayu.com';
    const password = 'Himanshu@123';
    
    // Get user from database
    const users = await d1Query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!users || users.length === 0) {
      console.log('❌ User not found in database');
      return;
    }
    
    const user = users[0];
    console.log('✅ User found:');
    console.log('   📧 Email:', user.email);
    console.log('   👤 Username:', user.username);
    console.log('   📛 Name:', user.name);
    console.log('   🎭 Role:', user.role);
    console.log('   🔒 Password hash:', user.password?.substring(0, 30) + '...');
    
    // Test password
    console.log('\n🔑 Testing password...');
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log('✅ PASSWORD CORRECT! Login should work.');
      console.log('\n╔════════════════════════════════════════════════════╗');
      console.log('║           LOGIN CREDENTIALS VERIFIED               ║');
      console.log('╠════════════════════════════════════════════════════╣');
      console.log(`║ 📧 Email:    ${email.padEnd(36)} ║`);
      console.log(`║ 🔑 Password: ${password.padEnd(36)} ║`);
      console.log('╚════════════════════════════════════════════════════╝\n');
    } else {
      console.log('❌ PASSWORD INCORRECT! There is an issue.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDoctorLogin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
