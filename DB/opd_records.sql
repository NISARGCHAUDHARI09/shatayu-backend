-- SQL schema for OPD records (excluding add new patient form fields)
CREATE TABLE opd_records (
	id INT AUTO_INCREMENT PRIMARY KEY,
	patient_name VARCHAR(100) NOT NULL,
	case_id VARCHAR(20) NOT NULL,
	appointment_date DATE,
	appointment_time VARCHAR(10),
	consultant VARCHAR(100),
	reference VARCHAR(100),
	symptoms VARCHAR(255),
	status VARCHAR(30),
	patient_age INT,
	patient_gender VARCHAR(10),
	patient_phone VARCHAR(20),
	patient_email VARCHAR(100),
	patient_address VARCHAR(255),
	blood_group VARCHAR(10),
	marital_status VARCHAR(20),
	medicines JSON,
	family_history JSON,
	ayurvedic_assessment JSON,
	examination JSON,
	clinical_assessment JSON,
	panchkarma JSON,
	treatment_plan VARCHAR(255),
	present_complaints JSON,
	documents JSON
);

-- Indexes for search and reporting
CREATE INDEX idx_opd_case_id ON opd_records(case_id);
CREATE INDEX idx_opd_patient_name ON opd_records(patient_name);
CREATE INDEX idx_opd_status ON opd_records(status);
