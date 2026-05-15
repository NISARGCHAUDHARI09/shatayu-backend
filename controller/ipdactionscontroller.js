// backend/controller/ipdactionscontroller.js
// Controller for IPD actions: treatment plan, medicine chart, progress notes
const db = require('../modules'); // Adjust if your DB connection is elsewhere

// Get treatment plan for a patient
exports.getTreatmentPlan = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await db.IPDPatient.findByPk(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ treatmentPlan: patient.treatmentPlan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update treatment plan
exports.updateTreatmentPlan = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { treatmentPlan } = req.body;
    await db.IPDPatient.update({ treatmentPlan }, { where: { id: patientId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get medicine chart for a patient
exports.getMedicineChart = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await db.IPDPatient.findByPk(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    const medicines = patient.medicines ? JSON.parse(patient.medicines) : [];
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update medicine chart
exports.updateMedicineChart = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { medicines } = req.body;
    await db.IPDPatient.update({ medicines: JSON.stringify(medicines) }, { where: { id: patientId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get progress notes for a patient
exports.getProgressNotes = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await db.IPDPatient.findByPk(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    const notes = patient.progressNotes ? JSON.parse(patient.progressNotes) : [];
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a progress note
exports.addProgressNote = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { note } = req.body;
    const patient = await db.IPDPatient.findByPk(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    let notes = patient.progressNotes ? JSON.parse(patient.progressNotes) : [];
    notes.push(note);
    await db.IPDPatient.update({ progressNotes: JSON.stringify(notes) }, { where: { id: patientId } });
    res.json({ success: true, progressNotes: notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optionally: delete/update progress notes endpoints
