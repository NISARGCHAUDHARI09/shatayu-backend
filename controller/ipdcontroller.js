// backend/controller/ipdcontroller.js
// Controller for IPD (In-Patient Department) management using Cloudflare D1
import { queryOne, query, execute } from '../config/d1-rest-client.js';

// Get all IPD patients with pagination
export const getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    console.log('🏥 Fetching all IPD patients...', { page, limit, status });
    
    let whereClause = '';
    const params = [];
    
    if (status) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }
    
    const patients = await query(
      `SELECT * FROM ipd_records ${whereClause} ORDER BY admission_date DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    
    const totalCount = await queryOne(
      `SELECT COUNT(*) as count FROM ipd_records ${whereClause}`,
      params
    );
    
    console.log('📊 Found IPD patients:', patients.length);
    res.json({
      success: true,
      data: patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount?.count || 0,
        totalPages: Math.ceil((totalCount?.count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching IPD patients:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch IPD patients' });
  }
};

// Admit new IPD patient (Create)
export const createPatient = async (req, res) => {
  try {
    const {
      patient_name,
      age,
      gender,
      phone,
      address,
      diagnosis,
      doctor_name,
      admission_date,
      room_number,
      bed_number,
      daily_charges,
      status = 'admitted'
    } = req.body;

    console.log('➕ Adding new IPD patient:', { patient_name, room_number });

    const result = await execute(
      `INSERT INTO ipd_records (
        patient_name, age, gender, phone, address, diagnosis,
        doctor_name, admission_date, room_number, bed_number,
        daily_charges, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [patient_name, age, gender, phone, address, diagnosis, doctor_name, 
       admission_date, room_number, bed_number, daily_charges, status]
    );

    console.log('✅ IPD patient added successfully');
    res.status(201).json({ 
      success: true, 
      message: 'IPD patient added successfully',
      id: result.meta.last_row_id 
    });
  } catch (error) {
    console.error('❌ Error adding IPD patient:', error);
    res.status(500).json({ success: false, error: 'Failed to add IPD patient' });
  }
};

// Get a patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('👁️ Viewing IPD patient:', id);
    
    const patient = await queryOne('SELECT * FROM ipd_records WHERE id = ?', [id]);
    
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    
    console.log('📄 Patient found:', patient.patient_name);
    res.json({ success: true, data: patient });
  } catch (error) {
    console.error('❌ Error viewing patient:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch patient' });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('✏️ Editing IPD patient:', id);
    
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), id];
    
    await execute(
      `UPDATE ipd_records SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    console.log('✅ Patient updated successfully');
    res.json({ success: true, message: 'Patient updated successfully' });
  } catch (error) {
    console.error('❌ Error updating patient:', error);
    res.status(500).json({ success: false, error: 'Failed to update patient' });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting IPD patient:', id);
    
    await execute('DELETE FROM ipd_records WHERE id = ?', [id]);
    
    console.log('✅ Patient deleted successfully');
    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting patient:', error);
    res.status(500).json({ success: false, error: 'Failed to delete patient' });
  }
};

// Discharge patient with summary
export const dischargePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { discharge_date, discharge_summary, final_charges } = req.body;
    
    console.log('🚪 Discharging IPD patient:', id);
    
    await execute(
      `UPDATE ipd_records SET 
        status = 'discharged',
        discharge_date = ?,
        discharge_summary = ?,
        final_charges = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [discharge_date, discharge_summary, final_charges, id]
    );
    
    console.log('✅ Patient discharged successfully');
    res.json({ success: true, message: 'Patient discharged successfully' });
  } catch (error) {
    console.error('❌ Error discharging patient:', error);
    res.status(500).json({ success: false, error: 'Failed to discharge patient' });
  }
};

// Get IPD statistics
export const getIPDStatistics = async (req, res) => {
  try {
    console.log('📊 Fetching IPD statistics...');
    
    const totalPatients = await queryOne('SELECT COUNT(*) as count FROM ipd_records');
    const admittedPatients = await queryOne('SELECT COUNT(*) as count FROM ipd_records WHERE status = "admitted"');
    const dischargedPatients = await queryOne('SELECT COUNT(*) as count FROM ipd_records WHERE status = "discharged"');
    
    // Skip revenue calculation since daily_charges column doesn't exist in current schema
    const totalRevenue = { total: 0 }; // Default value
    
    const stats = {
      total_patients: totalPatients?.count || 0,
      admitted_patients: admittedPatients?.count || 0,
      discharged_patients: dischargedPatients?.count || 0,
      total_revenue: totalRevenue?.total || 0,
      occupancy_rate: totalPatients?.count > 0 ? (admittedPatients?.count || 0) / totalPatients.count * 100 : 0
    };
    
    console.log('📈 IPD Statistics:', stats);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('❌ Error fetching IPD statistics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
};

// Get room status
export const getRoomStatus = async (req, res) => {
  try {
    console.log('🏠 Fetching room status...');
    
    const occupiedRooms = await query('SELECT DISTINCT room FROM ipd_records WHERE status = "admitted" AND room IS NOT NULL');
    const totalRooms = 50; // This should come from a rooms table in real implementation
    
    const roomStatus = {
      total_rooms: totalRooms,
      occupied_rooms: occupiedRooms.length,
      available_rooms: totalRooms - occupiedRooms.length,
      occupancy_percentage: (occupiedRooms.length / totalRooms) * 100,
      occupied_room_numbers: occupiedRooms.map(room => room.room)
    };
    
    console.log('🏠 Room Status:', roomStatus);
    res.json({ success: true, data: roomStatus });
  } catch (error) {
    console.error('❌ Error fetching room status:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch room status' });
  }
};
// Add medicine to patient
export const addMedicine = async (req, res) => {
  try {
    const { patientId, medicine } = req.body;
    console.log('💊 Adding medicine to IPD patient:', patientId);
    
    const patient = await queryOne('SELECT * FROM ipd_records WHERE id = ?', [patientId]);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    
    let medicines = patient.medicines ? JSON.parse(patient.medicines) : [];
    medicines.push({
      ...medicine,
      added_at: new Date().toISOString()
    });
    
    await execute(
      'UPDATE ipd_records SET medicines = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(medicines), patientId]
    );
    
    console.log('✅ Medicine added successfully');
    res.json({ success: true, message: 'Medicine added successfully', medicines });
  } catch (error) {
    console.error('❌ Error adding medicine:', error);
    res.status(500).json({ success: false, error: 'Failed to add medicine' });
  }
};

// Add progress note
export const addProgressNote = async (req, res) => {
  try {
    const { patientId, note } = req.body;
    console.log('📝 Adding progress note for IPD patient:', patientId);
    
    const patient = await queryOne('SELECT * FROM ipd_records WHERE id = ?', [patientId]);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    
    let notes = patient.progress_notes ? JSON.parse(patient.progress_notes) : [];
    notes.push({
      ...note,
      added_at: new Date().toISOString()
    });
    
    await execute(
      'UPDATE ipd_records SET progress_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(notes), patientId]
    );
    
    console.log('✅ Progress note added successfully');
    res.json({ success: true, message: 'Progress note added successfully', progressNotes: notes });
  } catch (error) {
    console.error('❌ Error adding progress note:', error);
    res.status(500).json({ success: false, error: 'Failed to add progress note' });
  }
};

// Get progress notes for patient
export const getProgressNotes = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log('📋 Fetching progress notes for patient:', patientId);
    
    const patient = await queryOne('SELECT progress_notes FROM ipd_records WHERE id = ?', [patientId]);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    
    const notes = patient.progress_notes ? JSON.parse(patient.progress_notes) : [];
    console.log('📄 Found progress notes:', notes.length);
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('❌ Error fetching progress notes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch progress notes' });
  }
};
