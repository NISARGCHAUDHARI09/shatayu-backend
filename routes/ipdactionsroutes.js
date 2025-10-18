// backend/routes/ipdactionsroutes.js
const express = require('express');
const router = express.Router();
const ipdActionsController = require('../controller/ipdactionscontroller');

// Treatment plan
router.get('/patients/:patientId/treatment-plan', ipdActionsController.getTreatmentPlan);
router.put('/patients/:patientId/treatment-plan', ipdActionsController.updateTreatmentPlan);

// Medicine chart
router.get('/patients/:patientId/medicine-chart', ipdActionsController.getMedicineChart);
router.put('/patients/:patientId/medicine-chart', ipdActionsController.updateMedicineChart);

// Progress notes
router.get('/patients/:patientId/progress-notes', ipdActionsController.getProgressNotes);
router.post('/patients/:patientId/progress-notes', ipdActionsController.addProgressNote);

// Optionally: delete/update progress notes endpoints

module.exports = router;
