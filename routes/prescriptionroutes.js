import express from 'express';
import { authenticateToken, requireDoctor } from '../middleware/authMiddleware.js';
import prescriptionController from '../controller/prescriptioncontroller.js';

const router = express.Router();

// Prescription routes (Doctor/Admin access required)
// Add new prescription
router.post('/', authenticateToken, requireDoctor, prescriptionController.addPrescription);

// Get prescription by ID
router.get('/:id', authenticateToken, requireDoctor, prescriptionController.getPrescription);

// Get all prescriptions for an OPD patient
router.get('/patient/:opd_patient_id', authenticateToken, requireDoctor, prescriptionController.getPrescriptionsByPatient);

export default router;
