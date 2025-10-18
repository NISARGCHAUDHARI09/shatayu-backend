// backend/routes/patientroutes.js
import express from 'express';
import { authenticateToken, requireDoctor } from '../middleware/authMiddleware.js';
import patientController from '../controller/patientcontroller.js';

const router = express.Router();

// CRUD for patients (Doctor/Admin access required)
router.get('/', authenticateToken, requireDoctor, patientController.getAllPatients);
router.get('/stats', authenticateToken, requireDoctor, patientController.getPatientStats);
router.get('/:id', authenticateToken, requireDoctor, patientController.getPatientById);
router.post('/', authenticateToken, requireDoctor, patientController.createPatient);
router.put('/:id', authenticateToken, requireDoctor, patientController.updatePatient);
router.delete('/:id', authenticateToken, requireDoctor, patientController.deletePatient);

// Bulk import patients (Doctor/Admin access required)
router.post('/import', authenticateToken, requireDoctor, patientController.importPatients);

export default router;