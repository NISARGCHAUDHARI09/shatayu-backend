// backend/controller/patientcontroller.js
// Controller for Patient Management
const db = require('../modules'); // Adjust if your DB connection is elsewhere

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await db.Patient.findAll();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await db.Patient.findByPk(id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const patient = await db.Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await db.Patient.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    const patient = await db.Patient.findByPk(id);
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.Patient.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Patient not found' });
    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bulk import patients
exports.importPatients = async (req, res) => {
  try {
    const { patients } = req.body;
    if (!patients || !Array.isArray(patients)) {
      return res.status(400).json({ error: 'Invalid patients data' });
    }
    
    const createdPatients = await db.Patient.bulkCreate(patients, {
      ignoreDuplicates: true,
      validate: true
    });
    
    res.status(201).json({
      success: true,
      message: `${createdPatients.length} patients imported successfully`,
      patients: createdPatients
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get patient statistics
exports.getPatientStats = async (req, res) => {
  try {
    const totalPatients = await db.Patient.count();
    const activePatients = await db.Patient.count({ where: { status: 'active' } });
    const admittedPatients = await db.Patient.count({ where: { status: 'admitted' } });
    const dischargedPatients = await db.Patient.count({ where: { status: 'discharged' } });
    
    res.json({
      totalPatients,
      activePatients,
      admittedPatients,
      dischargedPatients
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};