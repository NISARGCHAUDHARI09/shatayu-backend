// OPD routes using Cloudflare D1
import express from 'express';
import { authenticateToken, requireDoctor } from '../middleware/authMiddleware.js';
import {
  getAllPatients,
  addPatient,
  viewPatient,
  editPatient,
  deletePatient,
  savePrescription,
  saveMedicine,
  getOPDStatistics
} from '../controller/opdcontroller.js';

const router = express.Router();

// OPD patients CRUD (Doctor/Admin access required)
router.get('/', authenticateToken, requireDoctor, getAllPatients);
router.post('/', authenticateToken, requireDoctor, addPatient);
router.get('/statistics', authenticateToken, requireDoctor, getOPDStatistics);
router.get('/:id', authenticateToken, requireDoctor, viewPatient);
router.put('/:id', authenticateToken, requireDoctor, editPatient);
router.delete('/:id', authenticateToken, requireDoctor, deletePatient);

// OPD specific operations (Doctor/Admin access required)
router.post('/:id/prescription', authenticateToken, requireDoctor, savePrescription);
router.post('/:id/medicine', authenticateToken, requireDoctor, saveMedicine);

export default router;
