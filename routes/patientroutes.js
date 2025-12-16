// backend/routes/patientroutes.js
import express from 'express';
import { authenticateToken, requireDoctor } from '../middleware/authMiddleware.js';
import patientController from '../controller/patientcontroller.js';

const router = express.Router();

// Specific routes MUST come before parameterized routes
// Bulk import patients (TEMPORARILY OPEN FOR TESTING - NO AUTH)
router.post('/import', patientController.importPatients);

// CRUD for patients (TEMPORARILY OPEN FOR TESTING - NO AUTH)
router.get('/', patientController.getAllPatients);
router.get('/stats', patientController.getPatientStats);
router.get('/:id', patientController.getPatientById);
router.post('/', authenticateToken, requireDoctor, patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', authenticateToken, requireDoctor, patientController.deletePatient);

export default router;