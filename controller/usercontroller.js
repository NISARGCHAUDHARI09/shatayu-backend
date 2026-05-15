// User Management Controller for Hospital Management System
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query as d1Query, execute as d1Execute } from '../config/d1-rest-client.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'hardcoded_secret_for_demo';

// Create new user
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role, first_name, last_name, phone, department } = req.body;

    // Validation
    if (!username || !email || !password || !role || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: username, email, password, role, first_name, last_name'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate role
    const validRoles = ['admin', 'doctor', 'staff', 'patient'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be one of: admin, doctor, staff, patient'
      });
    }

    // Check if user already exists
    const existingUserCheck = await d1Query(
      `SELECT id FROM users WHERE email = ? OR username = ?`,
      [email, username]
    );

    if (existingUserCheck && existingUserCheck.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user in database
    const result = await d1Execute(
      `INSERT INTO users (username, email, password, role, first_name, last_name, phone, department, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [username, email, hashedPassword, role, first_name, last_name, phone || null, department || null]
    );

    if (result.success) {
      console.log(`✅ User created successfully: ${username} (${role})`);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: result.meta.last_row_id,
          username,
          email,
          role,
          first_name,
          last_name,
          department
        }
      });
    } else {
      throw new Error('Failed to create user in database');
    }
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while creating user'
    });
  }
};

// Get all users with pagination and filters
export const getAllUsers = async (req, res) => {
  console.log('🔍 DEBUG: getAllUsers called');
  try {
    const {
      page = 1,
      limit = 10,
      role,
      department,
      is_active,
      search
    } = req.query;

    console.log('🔍 DEBUG: Query params:', { page, limit, role, department, is_active, search });

    const offset = (page - 1) * limit;
    let whereConditions = ['deleted_at IS NULL'];
    let queryParams = [];

    // Add filters
    if (role) {
      whereConditions.push('role = ?');
      queryParams.push(role);
    }
    if (department) {
      whereConditions.push('department = ?');
      queryParams.push(department);
    }
    if (is_active !== undefined) {
      whereConditions.push('is_active = ?');
      queryParams.push(is_active === 'true' ? 1 : 0);
    }
    if (search) {
      whereConditions.push('(username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.join(' AND ');
    console.log('🔍 DEBUG: Where clause:', whereClause);
    console.log('🔍 DEBUG: Query params:', queryParams);

    // Get total count
    console.log('🔍 DEBUG: Getting count...');
    const countResult = await d1Query(
      `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`,
      queryParams
    );
    console.log('🔍 DEBUG: Count result:', countResult);

    // Get users
    console.log('🔍 DEBUG: Getting users...');
    const usersResult = await d1Query(
      `SELECT id, username, email, role, first_name, last_name, phone, department, 
              is_active, created_at, updated_at
       FROM users 
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );
    console.log('🔍 DEBUG: Users result:', usersResult);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    console.log(`✅ Retrieved ${usersResult?.length || 0} users (page ${page})`);
    
    res.json({
      success: true,
      data: usersResult || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching users'
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid user ID is required'
      });
    }

    const result = await d1Query(
      `SELECT id, username, email, role, first_name, last_name, phone, department, 
              is_active, created_at, updated_at
       FROM users 
       WHERE id = ? AND deleted_at IS NULL`,
      [parseInt(id)]
    );

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log(`✅ Retrieved user by ID: ${id}`);
    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('❌ Error fetching user by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching user'
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, first_name, last_name, phone, department, is_active } = req.body;

    // Check if user exists
    const existingUser = await d1Query(
      `SELECT id, role FROM users WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check for duplicate username/email if being updated
    if (username || email) {
      const duplicateCheck = await d1Query(
        `SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ? AND deleted_at IS NULL`,
        [username || '', email || '', id]
      );

      if (duplicateCheck && duplicateCheck.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'Username or email already exists for another user'
        });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const params = [];

    if (username) {
      updateFields.push('username = ?');
      params.push(username);
    }
    if (email) {
      updateFields.push('email = ?');
      params.push(email);
    }
    if (role) {
      const validRoles = ['admin', 'doctor', 'staff', 'patient'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role'
        });
      }
      updateFields.push('role = ?');
      params.push(role);
    }
    if (first_name) {
      updateFields.push('first_name = ?');
      params.push(first_name);
    }
    if (last_name) {
      updateFields.push('last_name = ?');
      params.push(last_name);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      params.push(phone);
    }
    if (department !== undefined) {
      updateFields.push('department = ?');
      params.push(department);
    }
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      params.push(is_active ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const result = await d1Execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    if (result.success) {
      console.log(`✅ User updated successfully: ID ${id}`);
      res.json({
        success: true,
        message: 'User updated successfully'
      });
    } else {
      throw new Error('Failed to update user');
    }
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while updating user'
    });
  }
};

// Delete user (soft delete)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await d1Query(
      `SELECT id, role FROM users WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent deleting the last admin
    if (existingUser[0].role === 'admin') {
      const adminCount = await d1Query(
        `SELECT COUNT(*) as count FROM users WHERE role = 'admin' AND deleted_at IS NULL`,
        []
      );

      if (adminCount[0].count <= 1) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete the last admin user'
        });
      }
    }

    // Soft delete the user
    const result = await d1Execute(
      `UPDATE users SET deleted_at = CURRENT_TIMESTAMP, is_active = 0 WHERE id = ?`,
      [id]
    );

    if (result.success) {
      console.log(`✅ User deleted successfully: ID ${id}`);
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } else {
      throw new Error('Failed to delete user');
    }
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while deleting user'
    });
  }
};

// Get user statistics
export const getUserStatistics = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      usersByRole,
      recentUsers,
      activeLastWeek
    ] = await Promise.all([
      d1Query(`SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL`),
      d1Query(`SELECT COUNT(*) as count FROM users WHERE is_active = 1 AND deleted_at IS NULL`),
      d1Query(`SELECT role, COUNT(*) as count FROM users WHERE is_active = 1 AND deleted_at IS NULL GROUP BY role`),
      d1Query(`SELECT COUNT(*) as count FROM users WHERE created_at >= datetime('now', '-30 days') AND deleted_at IS NULL`),
      d1Query(`SELECT COUNT(*) as count FROM users WHERE updated_at >= datetime('now', '-7 days') AND deleted_at IS NULL`)
    ]);

    const stats = {
      total: totalUsers[0]?.count || 0,
      active: activeUsers[0]?.count || 0,
      inactive: (totalUsers[0]?.count || 0) - (activeUsers[0]?.count || 0),
      byRole: usersByRole || [],
      recentSignups: recentUsers[0]?.count || 0,
      activeLastWeek: activeLastWeek[0]?.count || 0
    };

    console.log('✅ Retrieved user statistics');
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error fetching user statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching statistics'
    });
  }
};

// User login (Alternative to main auth system)
export const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
      return res.status(400).json({
        success: false,
        error: 'Email/username and password are required'
      });
    }

    // Find user by email or username
    const identifier = email || username;
    const result = await d1Query(
      `SELECT id, username, email, password, role, first_name, last_name, is_active, department
       FROM users 
       WHERE (email = ? OR username = ?) AND deleted_at IS NULL`,
      [identifier, identifier]
    );

    if (!result || result.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = result[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await d1Execute(
      `UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [user.id]
    );

    // Generate JWT token
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: `${user.first_name} ${user.last_name}`
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    console.log(`✅ User login successful: ${user.username}`);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`,
        department: user.department
      }
    });
  } catch (error) {
    console.error('❌ Error during user login:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
};