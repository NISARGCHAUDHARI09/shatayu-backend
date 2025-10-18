// backend/routes/medicinebillroutes.js
import express from 'express';
import * as medicineBillController from '../controller/medicinebillcontroller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new medicine bill
router.post('/create', medicineBillController.createMedicineBill);

// Get all medicine bills
router.get('/', medicineBillController.getAllBills);

// Get all bills for a patient
router.get('/patient/:patientId', medicineBillController.getBillsByPatient);

// Get a bill by ID
router.get('/:id', medicineBillController.getBillById);

// Update a bill
router.put('/:id', medicineBillController.updateBill);

// Delete a bill
router.delete('/:id', medicineBillController.deleteBill);

export default router;
