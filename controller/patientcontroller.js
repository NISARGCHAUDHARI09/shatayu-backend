// backend/controller/patientcontroller.js
// Controller for Patient Management
import { queryD1 } from '../config/d1-rest-client.js';

// Get all patients with pagination and search
export const getAllPatients = async (req, res) => {
  try {
    const search = req.query.search || "";
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    console.log(`📋 Fetching patients - Page: ${page}, Limit: ${limit}, Search: "${search}"`);

    // Always exclude soft-deleted patients
    let whereClause = "WHERE (status IS NULL OR status != 'deleted')";
    let params = [];
    
    if (search && search.trim() !== "") {
      whereClause += ` AND (
        LOWER(name) LIKE LOWER(?) OR 
        LOWER(patient_id) LIKE LOWER(?) OR 
        LOWER(phone) LIKE LOWER(?)
      )`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern];
    }

    // Get paginated data
    const dataQuery = `
      SELECT * FROM patients 
      ${whereClause}
      ORDER BY CAST(patient_id AS INTEGER) ASC 
      LIMIT ? OFFSET ?
    `;
    const dataParams = search ? [...params, limit, offset] : [limit, offset];
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM patients ${whereClause}`;
    const countParams = search ? params : [];

    // Execute both queries
    const [dataResult, countResult] = await Promise.all([
      queryD1(dataQuery, dataParams),
      queryD1(countQuery, countParams)
    ]);

    const data = dataResult.results || [];
    const total = countResult.results?.[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    console.log(`✅ Found ${data.length} patients (Total: ${total}, Page ${page}/${totalPages})`);

    res.json({
      success: true,
      data,
      total,
      page,
      limit,
      totalPages
    });
  } catch (err) {
    console.error('Get all patients error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      data: [],
      total: 0
    });
  }
};

// Get a patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await queryD1('SELECT * FROM patients WHERE id = ?', [id]);
    
    if (!result.results || result.results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(result.results[0]);
  } catch (err) {
    console.error('Get patient error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new patient
export const createPatient = async (req, res) => {
  try {
    const {
      patient_id, name, age, gender, phone, email, address,
      city, postal_code, country, constitution, primary_treatment, 
      patient_type, status, last_visit
    } = req.body;
    
    // Decide final patient_id: use provided one (e.g. OPD case number) if present, otherwise generate
    const finalPatientId = patient_id || `P${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const sql = `
      INSERT INTO patients (
        patient_id, name, age, gender, phone, email, address,
        city, postal_code, country, constitution, primary_treatment,
        patient_type, status, last_visit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await queryD1(sql, [
      finalPatientId,
      name, age || null, gender || null, phone || null, email || null, address || null,
      city || null, postal_code || null, country || 'India',
      constitution || null, primary_treatment || null, 
      patient_type || 'OPD', status || 'active',
      last_visit || new Date().toISOString().split('T')[0]
    ]);
    
    // Return the created patient_id so frontend can use it as OPD/case number
    res.status(201).json({ 
      success: true, 
      message: 'Patient created successfully',
      data: { patient_id: finalPatientId, id: finalPatientId }
    });
  } catch (err) {
    console.error('Create patient error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📝 Updating patient ID:', id);
    console.log('📝 Request body:', req.body);
    
    // Map camelCase to snake_case for database fields (only valid DB columns)
    const fieldMapping = {
      name: 'name',
      age: 'age',
      gender: 'gender',
      phone: 'phone',
      email: 'email',
      address: 'address',
      city: 'city',
      postalCode: 'postal_code',
      country: 'country',
      constitution: 'constitution',
      patientType: 'patient_type',
      status: 'status'
    };
    
    // Valid database columns (based on Cloudflare D1 schema)
    const validColumns = [
      'name', 'age', 'gender', 'phone', 'email', 'address',
      'city', 'postal_code', 'country', 'constitution',
      'primary_treatment', 'patient_type', 'status', 'last_visit'
    ];
    
    // Build dynamic update query with mapped fields
    const updateFields = [];
    const values = [];
    
    Object.keys(req.body).forEach(key => {
      const dbField = fieldMapping[key] || key;
      
      // Only include valid database columns
      if (validColumns.includes(dbField)) {
        updateFields.push(`${dbField} = ?`);
        values.push(req.body[key]);
      } else {
        console.warn(`⚠️ Skipping invalid field: ${key} (${dbField})`);
      }
    });
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const setClause = updateFields.join(', ');
    const query = `UPDATE patients SET ${setClause} WHERE id = ?`;
    
    console.log('🔄 Update query:', query);
    console.log('🔄 Update values:', [...values, id]);
    
    await queryD1(query, [...values, id]);
    
    console.log('✅ Patient updated successfully');
    res.json({ success: true, message: 'Patient updated successfully' });
  } catch (err) {
    console.error('❌ Update patient error:', err);
    res.status(500).json({ error: err.message, details: err.toString() });
  }
};

// Delete patient SOFT: mark as deleted (status), keep row for safety
export const deletePatient = async (req, res) => {
  try {
    const { id: patientIdParam } = req.params; // this is patient_id / OPD number from frontend

    console.log('🗑️ SOFT DELETE request for patient_id:', patientIdParam);

    // Mark patient as deleted; do not remove row to avoid FK problems
    await queryD1(
      "UPDATE patients SET status = 'deleted' WHERE patient_id = ?",
      [patientIdParam]
    );

    // Optional verification
    const check = await queryD1(
      'SELECT patient_id, status FROM patients WHERE patient_id = ?',
      [patientIdParam]
    );

    if (!check.results || check.results.length === 0 || check.results[0].status === 'deleted') {
      console.log('✅ Patient marked as deleted (soft delete).');
      return res.json({ success: true, message: 'Patient deleted successfully' });
    }

    console.error('❌ Failed to mark patient as deleted');
    return res.status(500).json({ success: false, error: 'Failed to delete patient' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Bulk import patients
export const importPatients = async (req, res) => {
  console.log('🚀 Import endpoint called!');
  console.log('📦 Request body:', {
    hasPatients: !!req.body.patients,
    patientsCount: req.body.patients?.length || 0,
    firstPatient: req.body.patients?.[0]
  });
  
  try {
    const { patients } = req.body;
    if (!patients || !Array.isArray(patients)) {
      console.error('❌ Invalid patients data:', typeof patients);
      return res.status(400).json({ error: 'Invalid patients data' });
    }
    
    console.log(`Importing ${patients.length} patients...`);
    
    let successCount = 0;
    const errors = [];
    
    // Use only the columns that exist in Cloudflare D1 table
    const sql = `
      INSERT INTO patients (
        patient_id, name, age, gender, phone, email, address,
        city, postal_code, country, constitution, primary_treatment, 
        patient_type, status, last_visit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Import each patient
    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      try {
        console.log(`Importing patient ${i + 1}/${patients.length}:`, patient.name);
        
        // Ensure phone is not null/empty (Cloudflare D1 requires it)
        const phone = patient.phone && patient.phone.trim() !== '' 
          ? patient.phone 
          : '0000000000'; // Default phone if empty
        
        await queryD1(sql, [
          patient.patientId || `P${Date.now()}${Math.floor(Math.random() * 1000)}`,
          patient.name,
          patient.age ? parseInt(patient.age) : null,
          patient.gender || null,
          phone, // Use validated phone
          patient.email || null,
          patient.address || null,
          patient.city || null,
          patient.postalCode || null,
          patient.country || 'India',
          patient.constitution || null,
          patient.primaryTreatment || null,
          patient.patientType || 'OPD',
          patient.status || 'active',
          patient.lastVisit || new Date().toISOString().split('T')[0]
        ]);
        
        successCount++;
        console.log(`✅ Patient ${i + 1} imported successfully`);
      } catch (err) {
        console.error(`❌ Error importing patient ${i + 1}:`, patient.name, err.message);
        errors.push({ index: i + 1, name: patient.name, error: err.message });
      }
    }
    
    console.log(`\n✅ Successfully imported ${successCount}/${patients.length} patients`);
    
    res.status(201).json({
      success: true,
      message: `${successCount} patients imported successfully`,
      count: successCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error('❌ Import error:', err);
    res.status(500).json({ error: err.message || 'Failed to import patients' });
  }
};

// Get patient statistics
export const getPatientStats = async (req, res) => {
  try {
    const totalResult = await queryD1('SELECT COUNT(*) as count FROM patients');
    const activeResult = await queryD1("SELECT COUNT(*) as count FROM patients WHERE status = 'active'");
    const admittedResult = await queryD1("SELECT COUNT(*) as count FROM patients WHERE status = 'admitted'");
    const dischargedResult = await queryD1("SELECT COUNT(*) as count FROM patients WHERE status = 'discharged'");
    
    res.json({
      totalPatients: totalResult.results[0]?.count || 0,
      activePatients: activeResult.results[0]?.count || 0,
      admittedPatients: admittedResult.results[0]?.count || 0,
      dischargedPatients: dischargedResult.results[0]?.count || 0
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get next OPD/patient number based on existing patients
export const getNextPatientNumber = async (req, res) => {
  try {
    const result = await queryD1(
      'SELECT MAX(CAST(patient_id AS INTEGER)) AS maxId FROM patients',
      []
    );

    const maxIdRaw = result.results && result.results[0] ? result.results[0].maxId : null;
    const maxId = maxIdRaw ? parseInt(maxIdRaw, 10) : 0;

    const nextId = (Number.isNaN(maxId) ? 0 : maxId) + 1;

    return res.json({ success: true, nextId });
  } catch (err) {
    console.error('Get next patient number error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Export as default object for backward compatibility
export default {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  importPatients,
  getPatientStats,
  getNextPatientNumber
};