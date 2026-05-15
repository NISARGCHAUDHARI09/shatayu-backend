// backend/controller/medicinebillcontroller.js
// Controller for patient medicine billing - uses Cloudflare D1 REST API
import { execute, query, queryOne } from '../config/d1-rest-client.js';

// Create a new medicine bill
export const createMedicineBill = async (req, res) => {
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
      `INSERT INTO medicine_bills 
      (patient_id, patient_name, patient_age, patient_gender, case_id, doctor_id, doctor_name, 
       medicines_json, total_amount, discount, final_total, reminder_date, finalized_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
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
    
    const newBill = queryOne('SELECT * FROM medicine_bills WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(newBill);
  } catch (err) {
    console.error('Error creating medicine bill:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all medicine bills
export const getAllBills = async (req, res) => {
  try {
    const bills = query(
      'SELECT * FROM medicine_bills ORDER BY created_at DESC'
    );
    res.json(bills);
  } catch (err) {
    console.error('Error fetching bills:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all bills for a patient
export const getBillsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const bills = query(
      'SELECT * FROM medicine_bills WHERE patient_id = ? ORDER BY created_at DESC',
      [patientId]
    );
    res.json(bills);
  } catch (err) {
    console.error('Error fetching bills by patient:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get a bill by ID
export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = queryOne('SELECT * FROM medicine_bills WHERE id = ?', [id]);
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    res.json(bill);
  } catch (err) {
    console.error('Error fetching bill by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update a bill
export const updateBill = async (req, res) => {
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
      `UPDATE medicine_bills SET 
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
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    const updatedBill = queryOne('SELECT * FROM medicine_bills WHERE id = ?', [id]);
    res.json(updatedBill);
  } catch (err) {
    console.error('Error updating bill:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a bill
export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const result = execute('DELETE FROM medicine_bills WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
