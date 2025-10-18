import express from 'express';
import { authenticateToken, requireDoctor } from '../middleware/authMiddleware.js';
import {
  getAllVedicMedicines,
  getVedicMedicineStats,
  createVedicMedicine,
  updateVedicMedicine,
  deleteVedicMedicine
} from '../controller/medicineVedicController.js';

const router = express.Router();

// Vedic medicine routes (Doctor/Admin access required)
router.get('/', authenticateToken, requireDoctor, getAllVedicMedicines);
router.get('/statistics', authenticateToken, requireDoctor, getVedicMedicineStats);
router.post('/', authenticateToken, requireDoctor, createVedicMedicine);
router.put('/:id', authenticateToken, requireDoctor, updateVedicMedicine);
router.delete('/:id', authenticateToken, requireDoctor, deleteVedicMedicine);

export default router;