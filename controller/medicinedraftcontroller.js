// backend/controller/medicinedraftcontroller.js
// Controller for patient medicine drafts - uses Cloudflare D1 REST API
import { execute, query, queryOne } from '../config/d1-rest-client.js';

// Create a new medicine draft
export const createMedicineDraft = async (req, res) => {
  try {
    const { 
      patientId, 
      patientName, 
      patientAge,
      patientGender,
      caseId,
      doctorId,
      doctorName,
      medicines, 
      total, 
      discount, 
      finalTotal, 
      reminderDate 
    } = req.body;
    
    if (!patientId || !patientName || !medicines || medicines.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: patientId, patientName, and medicines are required' });
    }
    
    const result = execute(
      `INSERT INTO draft_bills 
      (patient_id, patient_name, patient_age, patient_gender, case_id, doctor_id, doctor_name, 
       medicines_json, total_amount, discount, final_total, reminder_date, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [
        patientId,
        patientName,
        patientAge || null,
        patientGender || null,
        caseId || null,
        doctorId || null,
        doctorName || null,
        JSON.stringify(medicines),
        total || 0,
        discount || 0,
        finalTotal || 0,
        reminderDate || null
      ]
    );
    
    const newDraft = queryOne('SELECT * FROM draft_bills WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(newDraft);
  } catch (err) {
    console.error('Error creating medicine draft:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all medicine drafts
export const getAllDrafts = async (req, res) => {
  try {
    const drafts = query(
      'SELECT * FROM draft_bills ORDER BY created_at DESC'
    );
    res.json(drafts);
  } catch (err) {
    console.error('Error fetching drafts:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all drafts for a patient
export const getDraftsByPatient = async (req, res) => {
  try {
    const { patientId} = req.params;
    const drafts = query(
      'SELECT * FROM draft_bills WHERE patient_id = ? ORDER BY created_at DESC',
      [patientId]
    );
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a draft by ID
export const getDraftById = async (req, res) => {
  try {
    const { id } = req.params;
    const draft = queryOne('SELECT * FROM draft_bills WHERE id = ?', [id]);
    
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    
    res.json(draft);
  } catch (err) {
    console.error('Error fetching draft by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update a draft
export const updateDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      patientId, 
      patientName, 
      patientAge,
      patientGender,
      caseId,
      doctorId,
      doctorName,
      medicines, 
      total, 
      discount, 
      finalTotal, 
      reminderDate 
    } = req.body;
    
    const result = execute(
      `UPDATE draft_bills SET 
       patient_id = ?, patient_name = ?, patient_age = ?, patient_gender = ?,
       case_id = ?, doctor_id = ?, doctor_name = ?,
       medicines_json = ?, total_amount = ?, discount = ?, final_total = ?, reminder_date = ?
       WHERE id = ?`,
      [
        patientId,
        patientName,
        patientAge || null,
        patientGender || null,
        caseId || null,
        doctorId || null,
        doctorName || null,
        JSON.stringify(medicines),
        total || 0,
        discount || 0,
        finalTotal || 0,
        reminderDate || null,
        id
      ]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    
    const updatedDraft = queryOne('SELECT * FROM draft_bills WHERE id = ?', [id]);
    res.json(updatedDraft);
  } catch (err) {
    console.error('Error updating draft:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a draft
export const deleteDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const result = execute('DELETE FROM draft_bills WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    
    res.json({ message: 'Draft deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Convert a draft to a bill
export const convertDraftToBill = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the draft
    const draft = queryOne('SELECT * FROM draft_bills WHERE id = ?', [id]);
    
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    
    // Create a bill from the draft
    const result = execute(
      `INSERT INTO medicine_bills 
      (patient_id, patient_name, patient_age, patient_gender, case_id, doctor_id, doctor_name, 
       medicines_json, total_amount, discount, final_total, reminder_date, finalized_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        draft.patient_id,
        draft.patient_name,
        draft.patient_age,
        draft.patient_gender,
        draft.case_id,
        draft.doctor_id,
        draft.doctor_name,
        draft.medicines_json,
        draft.total_amount,
        draft.discount,
        draft.final_total,
        draft.reminder_date
      ]
    );
    
    // Delete the draft after converting to bill
    execute('DELETE FROM draft_bills WHERE id = ?', [id]);
    
    // Get the newly created bill
    const newBill = queryOne('SELECT * FROM medicine_bills WHERE id = ?', [result.lastInsertRowid]);
    
    res.status(201).json({ 
      message: 'Draft converted to bill successfully', 
      bill: newBill 
    });
  } catch (err) {
    console.error('Error converting draft to bill:', err);
    res.status(500).json({ error: err.message });
  }
};
