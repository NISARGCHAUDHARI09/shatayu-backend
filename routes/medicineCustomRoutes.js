import express from 'express';
import { authenticateToken, requireDoctor } from '../middleware/authMiddleware.js';
import {
  getAllCustomMedicines,
  getCustomMedicineStats,
  createCustomMedicine,
  updateCustomMedicine,
  deleteCustomMedicine
} from '../controller/medicineCustomController.js';

const router = express.Router();

// Custom medicine routes (Doctor/Admin access required)
router.get('/', authenticateToken, requireDoctor, getAllCustomMedicines);
router.get('/statistics', authenticateToken, requireDoctor, getCustomMedicineStats);
router.post('/', authenticateToken, requireDoctor, createCustomMedicine);
router.put('/:id', authenticateToken, requireDoctor, updateCustomMedicine);
router.delete('/:id', authenticateToken, requireDoctor, deleteCustomMedicine);

export default router;