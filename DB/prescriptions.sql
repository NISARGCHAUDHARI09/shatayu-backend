-- SQL schema for Prescriptions (based on OPD prescription modal)
CREATE TABLE prescriptions (
	id INT AUTO_INCREMENT PRIMARY KEY,
	opd_patient_id INT NOT NULL,
	prescription_date DATE NOT NULL,
	doctor_name VARCHAR(100),
	medicines JSON,
	instructions VARCHAR(255),
	notes VARCHAR(255),
	follow_up_date DATE,
	FOREIGN KEY (opd_patient_id) REFERENCES opd_records(id)
);

-- Indexes for reporting and search
CREATE INDEX idx_prescription_opd_patient_id ON prescriptions(opd_patient_id);
CREATE INDEX idx_prescription_date ON prescriptions(prescription_date);
