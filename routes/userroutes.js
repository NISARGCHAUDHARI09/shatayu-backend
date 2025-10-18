// User Management Routes with Authentication Middleware
import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStatistics,
  loginUser
} from '../controller/usercontroller.js';

const router = express.Router();

// Public routes (no authentication required)
// POST /api/users/login - User login
router.post('/login', loginUser);

// Protected routes (authentication required)
// All user management operations require admin privileges

// GET /api/users/statistics - Get user statistics (Admin only)
router.get('/statistics', authenticateToken, requireAdmin, getUserStatistics);

// GET /api/users/ - Get all users with pagination and filters (Admin only)
router.get('/', authenticateToken, requireAdmin, getAllUsers);

// POST /api/users/create - Create new user (Admin only)
router.post('/create', authenticateToken, requireAdmin, createUser);

// GET /api/users/:id - Get specific user by ID (Admin only)
router.get('/:id', authenticateToken, requireAdmin, getUserById);

// PUT /api/users/:id - Update user (Admin only)
router.put('/:id', authenticateToken, requireAdmin, updateUser);

// DELETE /api/users/:id - Delete user (soft delete) (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;