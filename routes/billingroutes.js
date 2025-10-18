import express from 'express';
import {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
  getBillingStats
} from '../controller/billingcontroller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/billing - Get all bills
router.get('/', getAllBills);

// GET /api/billing/stats - Get billing statistics
router.get('/stats', getBillingStats);

// GET /api/billing/:id - Get single bill
router.get('/:id', getBillById);

// POST /api/billing - Create new bill
router.post('/', createBill);

// PUT /api/billing/:id - Update bill
router.put('/:id', updateBill);

// DELETE /api/billing/:id - Delete bill
router.delete('/:id', deleteBill);

export default router;
