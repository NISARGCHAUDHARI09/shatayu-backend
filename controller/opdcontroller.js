// OPD Controller using Cloudflare D1
import { queryOne, query, execute } from '../config/d1-rest-client.js';

// Add new OPD patient
const addPatient = async (req, res) => {
	const {
		patientName,
		caseId,
		appointmentDate,
		appointmentTime,
		consultant,
		reference,
		presentComplaints,
		ayurvedicAssessment,
		examination,
		clinicalAssessment,
		familyHistory,
		medicines,
		treatmentPlan,
		panchkarmas,
		patientAge,
		patientGender,
		patientPhone,
		patientEmail,
		bloodGroup,
		maritalStatus,
		patientAddress,
		documents
	} = req.body;
	
	try {
		console.log('➕ Adding new OPD patient:', patientName);
		
		const result = await execute(
			`INSERT INTO opd_records (
				patient_name, case_id, appointment_date, appointment_time, consultant, reference, 
				present_complaints, ayurvedic_assessment, examination, clinical_assessment, family_history, 
				medicines, treatment_plan, panchkarma, patient_age, patient_gender, patient_phone, 
				patient_email, blood_group, marital_status, patient_address, documents, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
			[
				patientName,
				caseId,
				appointmentDate,
				appointmentTime,
				consultant,
				reference,
				JSON.stringify(presentComplaints),
				JSON.stringify(ayurvedicAssessment),
				JSON.stringify(examination),
				JSON.stringify(clinicalAssessment),
				JSON.stringify(familyHistory),
				JSON.stringify(medicines),
				treatmentPlan,
				JSON.stringify(panchkarmas),
				patientAge,
				patientGender,
				patientPhone,
				patientEmail,
				bloodGroup,
				maritalStatus,
				patientAddress,
				JSON.stringify(documents)
			]
		);
		
		console.log('✅ OPD patient added successfully');
		res.status(201).json({ 
			success: true, 
			message: 'Patient added successfully',
			id: result.meta.last_row_id 
		});
	} catch (error) {
		console.error('❌ Error adding OPD patient:', error);
		res.status(500).json({ success: false, error: 'Failed to add patient' });
	}
};

// View OPD patient details
const viewPatient = async (req, res) => {
	const id = req.params.id;
	try {
		console.log('👁️ Viewing OPD patient:', id);
		
		const patient = await queryOne('SELECT * FROM opd_records WHERE id = ?', [id]);
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

// Edit OPD patient details
const editPatient = async (req, res) => {
	const id = req.params.id;
	const updateData = req.body;
	
	try {
		console.log('✏️ Editing OPD patient:', id);
		
		const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
		const values = [...Object.values(updateData), id];
		
		await execute(
			`UPDATE opd_records SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
			values
		);
		
		console.log('✅ Patient updated successfully');
		res.json({ success: true, message: 'Patient updated successfully' });
	} catch (error) {
		console.error('❌ Error updating patient:', error);
		res.status(500).json({ success: false, error: 'Failed to update patient' });
	}
};

// Delete OPD patient
const deletePatient = async (req, res) => {
	const id = req.params.id;
	try {
		console.log('🗑️ Deleting OPD patient:', id);
		
		await execute('DELETE FROM opd_records WHERE id = ?', [id]);
		
		console.log('✅ Patient deleted successfully');
		res.json({ success: true, message: 'Patient deleted successfully' });
	} catch (error) {
		console.error('❌ Error deleting patient:', error);
		res.status(500).json({ success: false, error: 'Failed to delete patient' });
	}
};

// Save prescription for OPD patient
const savePrescription = async (req, res) => {
	const id = req.params.id;
	const { prescription_date, doctor_name, medicines, instructions, notes, follow_up_date, complaints, ayurvedic_assessment, examination, roga } = req.body;
	
	console.log('📝 Saving prescription for OPD patient:', {
		opdPatientId: id,
		prescriptionDate: prescription_date,
		doctorName: doctor_name,
		medicinesCount: medicines?.length,
		hasInstructions: !!instructions,
		hasNotes: !!notes,
		followUpDate: follow_up_date,
		hasComplaints: !!complaints,
		hasAyurvedicAssessment: !!ayurvedic_assessment,
		hasExamination: !!examination,
		roga: roga
	});

	try {
		const result = await execute(
			'INSERT INTO prescriptions (opd_patient_id, prescription_date, doctor_name, medicines, instructions, notes, follow_up_date, complaints, ayurvedic_assessment, examination, roga) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[id, prescription_date, doctor_name, JSON.stringify(medicines), instructions, notes, follow_up_date, JSON.stringify(complaints), JSON.stringify(ayurvedic_assessment), JSON.stringify(examination), roga]
		);

		console.log('✅ Prescription saved successfully:', { prescriptionId: result.meta?.last_row_id });
		res.json({ 
			success: true, 
			message: 'Prescription saved successfully',
			prescriptionId: result.meta?.last_row_id
		});
	} catch (error) {
		console.error('❌ Error saving prescription:', error);
		res.status(500).json({ success: false, error: 'Failed to save prescription' });
	}
};

// Save medicine bill for OPD patient
const saveMedicine = async (req, res) => {
	const id = req.params.id;
	const { medicines, notes } = req.body;
	
	console.log('💊 Saving medicine bill for OPD patient:', {
		opdPatientId: id,
		medicinesCount: medicines?.length,
		hasNotes: !!notes
	});

	try {
		const result = await execute(
			'UPDATE opd_records SET medicines = ? WHERE id = ?',
			[JSON.stringify(medicines), id]
		);

		console.log('✅ Medicine bill saved successfully:', { 
			changedRows: result.meta?.changes,
			opdPatientId: id 
		});
		
		res.json({ 
			success: true, 
			message: 'Medicine bill saved successfully',
			changedRows: result.meta?.changes
		});
	} catch (error) {
		console.error('❌ Error saving medicine bill:', error);
		res.status(500).json({ success: false, error: 'Failed to save medicine bill' });
	}
};

// Get all OPD patients with pagination and filtering
const getAllPatients = async (req, res) => {
	const { page = 1, limit = 10, search = '', status = '', date_from = '', date_to = '' } = req.query;
	const offset = (page - 1) * limit;

	console.log('📋 Getting all OPD patients:', {
		page: parseInt(page),
		limit: parseInt(limit),
		search,
		status,
		dateFrom: date_from,
		dateTo: date_to,
		offset
	});

	try {
		let whereConditions = [];
		let params = [];

		// Add search condition
		if (search) {
			whereConditions.push('(patient_name LIKE ? OR mobile LIKE ? OR patient_id LIKE ?)');
			params.push(`%${search}%`, `%${search}%`, `%${search}%`);
		}

		// Add status filter
		if (status) {
			whereConditions.push('status = ?');
			params.push(status);
		}

		// Add date range filter
		if (date_from) {
			whereConditions.push('visit_date >= ?');
			params.push(date_from);
		}
		if (date_to) {
			whereConditions.push('visit_date <= ?');
			params.push(date_to);
		}

		const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

		// Get total count
		const countQuery = `SELECT COUNT(*) as total FROM opd_records ${whereClause}`;
		const countResult = await queryOne(countQuery, params);
		const total = countResult.total;

		// Get paginated results
		const dataQuery = `
			SELECT * FROM opd_records 
			${whereClause}
			ORDER BY visit_date DESC, created_at DESC 
			LIMIT ? OFFSET ?
		`;
		const dataParams = [...params, parseInt(limit), offset];
		const patients = await query(dataQuery, dataParams);

		console.log('✅ OPD patients retrieved successfully:', {
			total,
			returned: patients.length,
			page: parseInt(page),
			totalPages: Math.ceil(total / limit)
		});

		res.json({
			success: true,
			data: patients,
			pagination: {
				current_page: parseInt(page),
				per_page: parseInt(limit),
				total: total,
				total_pages: Math.ceil(total / limit),
				has_more: (page * limit) < total
			}
		});
	} catch (error) {
		console.error('❌ Error getting OPD patients:', error);
		res.status(500).json({ success: false, error: 'Failed to retrieve OPD patients' });
	}
};

// Get OPD statistics
const getOPDStatistics = async (req, res) => {
	console.log('📊 Getting OPD statistics...');

	try {
		// Get total patients
		const totalResult = await queryOne('SELECT COUNT(*) as total FROM opd_records');
		const total = totalResult.total;

		// Get today's patients
		const todayResult = await queryOne(
			'SELECT COUNT(*) as today FROM opd_records WHERE DATE(visit_date) = DATE("now")'
		);
		const today = todayResult.today;

		// Get this month's patients
		const monthResult = await queryOne(
			'SELECT COUNT(*) as month FROM opd_records WHERE strftime("%Y-%m", visit_date) = strftime("%Y-%m", "now")'
		);
		const thisMonth = monthResult.month;

		// Get status distribution
		const statusResult = await query(
			'SELECT status, COUNT(*) as count FROM opd_records GROUP BY status'
		);

		// Get recent patients (last 5)
		const recentPatients = await query(
			'SELECT id, patient_name, visit_date, status FROM opd_records ORDER BY visit_date DESC, created_at DESC LIMIT 5'
		);

		const statistics = {
			total,
			today,
			thisMonth,
			statusDistribution: statusResult,
			recentPatients
		};

		console.log('✅ OPD statistics retrieved successfully:', statistics);

		res.json({
			success: true,
			data: statistics
		});
	} catch (error) {
		console.error('❌ Error getting OPD statistics:', error);
		res.status(500).json({ success: false, error: 'Failed to retrieve OPD statistics' });
	}
};

// Export all functions
export {
	getAllPatients,
	addPatient,
	viewPatient,
	editPatient,
	deletePatient,
	savePrescription,
	saveMedicine,
	getOPDStatistics
};
