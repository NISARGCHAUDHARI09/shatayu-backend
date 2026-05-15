// IPD routes using Cloudflare D1
import express from 'express';
import { authenticateToken, requireDoctor } from '../middleware/authMiddleware.js';
import {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  dischargePatient,
  getIPDStatistics,
  getRoomStatus,
  addMedicine,
  addProgressNote
} from '../controller/ipdcontroller.js';

const router = express.Router();

// IPD patients CRUD (Doctor/Admin access required)
router.get('/patients', authenticateToken, requireDoctor, getAllPatients);
router.post('/patients', authenticateToken, requireDoctor, createPatient);
router.get('/patients/:id', authenticateToken, requireDoctor, getPatientById);
router.put('/patients/:id', authenticateToken, requireDoctor, updatePatient);
router.delete('/patients/:id', authenticateToken, requireDoctor, deletePatient);

// IPD specific operations (Doctor/Admin access required)
router.post('/patients/:id/discharge', authenticateToken, requireDoctor, dischargePatient);
router.get('/statistics', authenticateToken, requireDoctor, getIPDStatistics);
router.get('/rooms/status', authenticateToken, requireDoctor, getRoomStatus);

// Medicine and progress notes (Doctor/Admin access required)
router.post('/patients/:id/medicine', authenticateToken, requireDoctor, addMedicine);
router.post('/patients/:id/progress-note', authenticateToken, requireDoctor, addProgressNote);

export default router;
