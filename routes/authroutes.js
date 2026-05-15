// backend/routes/authroutes.js
// Authentication routes for login and user management
import express from 'express';
import {
  login,
  verifyToken,
  getCurrentUser,
  getAllUsers,
  createUser
} from '../controller/authcontroller.js';

const router = express.Router();

// Public routes (no authentication required)

// POST /api/auth/login - Login and get JWT token
router.post('/login', login);

// Protected routes (authentication required)

// GET /api/auth/me - Get current user information
router.get('/me', verifyToken, getCurrentUser);

// GET /api/auth/users - Get all users (admin only)
router.get('/users', verifyToken, getAllUsers);

// POST /api/auth/users - Create new user (admin only)
router.post('/users', verifyToken, createUser);

export default router;
