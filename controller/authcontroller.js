// backend/controller/authcontroller.js
// Authentication controller for user login and JWT management
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// Using Cloudflare D1 REST API
import { query, queryOne, execute } from '../config/d1-rest-client.js';

const JWT_SECRET = process.env.JWT_SECRET || '2fcdd278de57cbc5b12644850b53a4dfc87e6b67d57a6ad185a5b116d973fb1078343f00ec7a93c60b4b290b5fc0bc6dcfb49b233db3a6c30078656c16fcd61f';

/**
 * Login user and generate JWT token
 * POST /api/auth/login
 * Body: { email: string, password: string }
 */
export const login = async (req, res) => {
  console.log('\n🚀 === LOGIN API CALLED ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Request method:', req.method);
  console.log('📍 Request URL:', req.url);
  console.log('📝 Request headers:', JSON.stringify(req.headers, null, 2));
  
  try {
    // Step 1: Extract email and password from request body
    const { email, password } = req.body;
    console.log('� Request body:', JSON.stringify(req.body, null, 2));
    console.log('�🔐 Login attempt for email:', email);
    console.log('🔑 Password provided:', password ? '✅ Yes' : '❌ No');
    
    // Step 2: Validate input
    if (!email || !password) {
      console.log('❌ VALIDATION FAILED: Missing email or password');
      console.log('   - Email present:', !!email);
      console.log('   - Password present:', !!password);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    console.log('✅ VALIDATION PASSED: Email and password provided');
    
    // Step 3: Query database for user
    console.log('🔍 STEP 3: Querying Cloudflare D1 database...');
    console.log('   SQL Query: SELECT * FROM users WHERE email = ?');
    console.log('   Parameters:', [email]);
    
    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email]);
    
    console.log('📊 DATABASE QUERY RESULT:');
    if (user) {
      console.log('   ✅ USER FOUND in database');
      console.log('   👤 User ID:', user.id);
      console.log('   📧 User email:', user.email);
      console.log('   👨‍💻 Username:', user.username);
      console.log('   📛 Name:', user.name);
      console.log('   🎭 Role:', user.role);
      console.log('   🔒 Password hash:', user.password ? user.password.substring(0, 20) + '...' : 'NULL');
      console.log('   📅 Created:', user.created_at);
      console.log('   🔑 Full user object:', JSON.stringify(user, null, 2));
    } else {
      console.log('   ❌ USER NOT FOUND in database');
      console.log('   🔍 Searched for email:', email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }
    
    // Step 4: Password verification
    console.log('� STEP 4: Password verification...');
    console.log('   🔑 Input password:', password);
    console.log('   � Database password:', user.password);
    console.log('   🧪 Password hash type:', user.password?.startsWith('$2') ? 'bcrypt' : 'plain text');
    
    let isPasswordValid = false;
    
    if (user.password && user.password.startsWith('$2')) {
      console.log('   🔐 Using bcrypt.compare for hashed password...');
      isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('   🎯 bcrypt.compare result:', isPasswordValid);
    } else {
      console.log('   ⚠️  Using plain text comparison (NOT RECOMMENDED)...');
      isPasswordValid = user.password === password;
      console.log('   🎯 Plain comparison result:', isPasswordValid);
      console.log('   📝 Expected:', user.password);
      console.log('   📝 Received:', password);
    }
    
    if (!isPasswordValid) {
      console.log('❌ PASSWORD VERIFICATION FAILED');
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    console.log('✅ PASSWORD VERIFICATION PASSED');
    
    // Step 5: Generate JWT token
    console.log('🎫 STEP 5: Generating JWT token...');
    console.log('   🔐 JWT Secret:', JWT_SECRET ? 'Present' : 'Missing');
    console.log('   📋 Token payload:');
    console.log('     - ID:', user.id);
    console.log('     - Username:', user.username);
    console.log('     - Email:', user.email);
    console.log('     - Name:', user.name);
    console.log('     - Role:', user.role);
    
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET); // No expiration as requested
    console.log('   🎫 JWT token generated:', token.substring(0, 50) + '...');
    
    // Step 6: Prepare response
    console.log('📤 STEP 6: Preparing successful response...');
    const responseData = {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at
      }
    };
    
    console.log('✅ LOGIN SUCCESSFUL');
    console.log('   📧 Email:', email);
    console.log('   🎭 Role:', user.role);
    console.log('   🎫 Token created:', !!token);
    console.log('🚀 === LOGIN API COMPLETED SUCCESSFULLY ===\n');
    
    return res.status(200).json(responseData);
    
  } catch (error) {
    console.error('💥 === LOGIN API ERROR ===');
    console.error('❌ Error message:', error.message);
    console.error('📍 Error name:', error.name);
    console.error('🔍 Error stack trace:');
    console.error(error.stack);
    console.error('🚨 === END ERROR DETAILS ===\n');
    
    return res.status(500).json({ 
      success: false,
      error: 'Login failed. Please try again.'
    });
  }
};

// Verify JWT token (middleware)
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      error: 'Invalid or expired token' 
    });
  }
};

// Get current user info (protected route)
export const getCurrentUser = async (req, res) => {
  try {
    const user = await queryOne('SELECT id, username, email, name, role, created_at FROM users WHERE id = ?', [req.user.id]);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get user information' 
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied. Admin only.' 
      });
    }

    const users = await query('SELECT id, username, email, name, role, created_at FROM users ORDER BY created_at DESC');

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch users' 
    });
  }
};

// Create new user (admin only - for manual user creation)
export const createUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied. Admin only.' 
      });
    }

    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        error: 'Email, password, and role are required' 
      });
    }

    // Validate role
    if (!['admin', 'doctor'].includes(role)) {
      return res.status(400).json({ 
        success: false,
        error: 'Role must be either "admin" or "doctor"' 
      });
    }

    // Check if user already exists
    const existingUser = await queryOne('SELECT id FROM users WHERE email = ?', [email]);

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await execute(
      'INSERT INTO users (username, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
      [email.split('@')[0], email, hashedPassword, email.split('@')[0], role]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: userId,
        email,
        role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create user' 
    });
  }
};

export default {
  login,
  verifyToken,
  getCurrentUser,
  getAllUsers,
  createUser
};
