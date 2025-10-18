import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffStatistics,
  applyLeave,
  getStaffLeave,
  updateLeaveStatus,
  getDepartments,
  importStaff
} from '../controller/staffcontroller.js';

const router = express.Router();

// Staff management routes (Admin access required)

// GET /api/staff - Get all staff with optional filters and pagination
router.get('/', authenticateToken, requireAdmin, getAllStaff);

// GET /api/staff/statistics - Get staff statistics and analytics
router.get('/statistics', authenticateToken, requireAdmin, getStaffStatistics);

// GET /api/staff/departments - Get all departments
router.get('/departments', authenticateToken, requireAdmin, getDepartments);

// GET /api/staff/:id - Get specific staff member by ID
router.get('/:id', authenticateToken, requireAdmin, getStaffById);

// POST /api/staff - Create new staff member
router.post('/', authenticateToken, requireAdmin, createStaff);

// POST /api/staff/import - Import multiple staff members from Excel/CSV
router.post('/import', authenticateToken, requireAdmin, importStaff);

// PUT /api/staff/:id - Update staff member
router.put('/:id', authenticateToken, requireAdmin, updateStaff);

// DELETE /api/staff/:id - Delete (deactivate) staff member
router.delete('/:id', authenticateToken, requireAdmin, deleteStaff);

// Leave management routes (Admin access for approval, authenticated for apply)

// POST /api/staff/leave/apply - Apply for leave (any authenticated user can apply)
router.post('/leave/apply', authenticateToken, applyLeave);

// GET /api/staff/:staff_id/leave - Get leave history for specific staff
router.get('/:staff_id/leave', authenticateToken, requireAdmin, getStaffLeave);

// PUT /api/staff/leave/:leave_id/status - Update leave status (approve/reject)
router.put('/leave/:leave_id/status', authenticateToken, requireAdmin, updateLeaveStatus);

export default router;