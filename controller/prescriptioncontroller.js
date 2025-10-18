// Prescription Controller using Cloudflare D1
import { queryOne, query, execute } from '../config/d1-rest-client.js';

// Add new prescription
const addPrescription = async (req, res) => {
    const {
        opd_patient_id,
        prescription_date,
        doctor_name,
        medicines,
        instructions,
        notes,
        follow_up_date,
        complaints,
        ayurvedic_assessment,
        examination,
        roga
    } = req.body;

    console.log('📝 Adding new prescription:', {
        opdPatientId: opd_patient_id,
        prescriptionDate: prescription_date,
        doctorName: doctor_name,
        medicinesCount: medicines?.length,
        hasInstructions: !!instructions
    });

    try {
        const result = await execute(
            'INSERT INTO prescriptions (opd_patient_id, prescription_date, doctor_name, medicines, instructions, notes, follow_up_date, complaints, ayurvedic_assessment, examination, roga) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                opd_patient_id,
                prescription_date,
                doctor_name,
                JSON.stringify(medicines),
                instructions,
                notes,
                follow_up_date,
                JSON.stringify(complaints),
                JSON.stringify(ayurvedic_assessment),
                JSON.stringify(examination),
                roga
            ]
        );

        console.log('✅ Prescription added successfully:', { 
            prescriptionId: result.meta?.last_row_id,
            opdPatientId: opd_patient_id 
        });

        res.json({ 
            success: true, 
            message: 'Prescription added successfully',
            prescriptionId: result.meta?.last_row_id
        });
    } catch (error) {
        console.error('❌ Error adding prescription:', error);
        res.status(500).json({ success: false, error: 'Failed to add prescription' });
    }
};

// Get prescription by ID
const getPrescription = async (req, res) => {
    const id = req.params.id;
    
    console.log('📖 Getting prescription by ID:', { prescriptionId: id });

    try {
        const prescription = await queryOne('SELECT * FROM prescriptions WHERE id = ?', [id]);
        
        if (!prescription) {
            console.log('❌ Prescription not found:', { prescriptionId: id });
            return res.status(404).json({ success: false, error: 'Prescription not found' });
        }

        console.log('✅ Prescription retrieved successfully:', { 
            prescriptionId: id,
            doctorName: prescription.doctor_name 
        });

        res.json({ 
            success: true, 
            data: prescription 
        });
    } catch (error) {
        console.error('❌ Error getting prescription:', error);
        res.status(500).json({ success: false, error: 'Failed to retrieve prescription' });
    }
};

// Get all prescriptions for an OPD patient
const getPrescriptionsByPatient = async (req, res) => {
    const opd_patient_id = req.params.opd_patient_id;
    
    console.log('📋 Getting prescriptions for patient:', { opdPatientId: opd_patient_id });

    try {
        const prescriptions = await query('SELECT * FROM prescriptions WHERE opd_patient_id = ? ORDER BY prescription_date DESC', [opd_patient_id]);
        
        console.log('✅ Prescriptions retrieved successfully:', { 
            opdPatientId: opd_patient_id,
            count: prescriptions.length 
        });

        res.json({ 
            success: true, 
            data: prescriptions 
        });
    } catch (error) {
        console.error('❌ Error getting prescriptions for patient:', error);
        res.status(500).json({ success: false, error: 'Failed to retrieve prescriptions' });
    }
};

// Export all functions
export {
    addPrescription,
    getPrescription,
    getPrescriptionsByPatient
};
