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
    
    // Convert camelCase to snake_case for database
    const convertedPatients = patients.map(patient => ({
      patient_id: patient.patientId || `P${Date.now()}${Math.floor(Math.random() * 1000)}`,
      name: patient.name,
      age: patient.age ? parseInt(patient.age) : null,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || null,
      address: patient.address || null,
      city: patient.city || null,
      state: patient.state || null,
      postal_code: patient.postalCode || null,
      country: patient.country || 'India',
      date_of_birth: patient.dateOfBirth || null,
      blood_group: patient.bloodGroup || null,
      constitution: patient.constitution || null,
      primary_treatment: patient.primaryTreatment || null,
      patient_type: patient.patientType || 'OPD',
      status: patient.status || 'active',
      last_visit: patient.lastVisit || new Date().toISOString().split('T')[0],
      emergency_contact: patient.emergencyContact || null,
      medical_history: patient.medicalHistory || null,
      allergies: patient.allergies || null,
      current_medication: patient.currentMedication || null
    }));
    
    const createdPatients = await db.Patient.bulkCreate(convertedPatients, {
      ignoreDuplicates: true,
      validate: true
    });
    
    res.status(201).json({
      success: true,
      message: `${createdPatients.length} patients imported successfully`,
      count: createdPatients.length
    });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ error: err.message || 'Failed to import patients' });
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