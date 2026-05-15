// Inventory routes using Cloudflare D1
import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';
import {
  getAllItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,
  getInventoryStatistics,
  getLowStockItems,
  recordStockMovement
} from '../controller/inventorycontroller.js';

const router = express.Router();

// Inventory management routes (Admin access required for management, authenticated for viewing)

// GET /api/inventory - Get all inventory items with optional filters and pagination
router.get('/', authenticateToken, getAllItems);

// GET /api/inventory/statistics - Get inventory statistics and analytics
router.get('/statistics', authenticateToken, requireAdmin, getInventoryStatistics);

// GET /api/inventory/low-stock - Get low stock items
router.get('/low-stock', authenticateToken, requireAdmin, getLowStockItems);

// POST /api/inventory/movements - Record a new inventory movement
router.post('/movements', authenticateToken, requireAdmin, recordStockMovement);

// GET /api/inventory/:id - Get specific inventory item by ID
router.get('/:id', authenticateToken, getItem);

// POST /api/inventory - Create new inventory item
router.post('/', authenticateToken, requireAdmin, addItem);

// PUT /api/inventory/:id - Update inventory item
router.put('/:id', authenticateToken, requireAdmin, updateItem);

// DELETE /api/inventory/:id - Delete inventory item
router.delete('/:id', authenticateToken, requireAdmin, deleteItem);

export default router;