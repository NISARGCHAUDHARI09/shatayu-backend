// backend/routes/medicinedraftroutes.js
import express from 'express';
import * as medicineDraftController from '../controller/medicinedraftcontroller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new medicine draft
router.post('/create', medicineDraftController.createMedicineDraft);

// Get all medicine drafts
router.get('/', medicineDraftController.getAllDrafts);

// Get all drafts for a patient
router.get('/patient/:patientId', medicineDraftController.getDraftsByPatient);

// Get a draft by ID
router.get('/:id', medicineDraftController.getDraftById);

// Update a draft
router.put('/:id', medicineDraftController.updateDraft);

// Delete a draft
router.delete('/:id', medicineDraftController.deleteDraft);

// Convert draft to bill
router.post('/:id/convert-to-bill', medicineDraftController.convertDraftToBill);

export default router;
