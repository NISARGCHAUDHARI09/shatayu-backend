-- SQL schema for Panchkarma treatments (used in OPD add new patient form)
CREATE TABLE panchkarma (
	id INT AUTO_INCREMENT PRIMARY KEY,
	opd_patient_id INT NOT NULL,
	category VARCHAR(50) NOT NULL,
	start_date DATE,
	end_date DATE,
	notes VARCHAR(255),
	-- Subcategories as JSON array: [{name, duration, isCustom}]
	subcategories JSON,
	FOREIGN KEY (opd_patient_id) REFERENCES opd_records(id)
);

-- Indexes for reporting and search
CREATE INDEX idx_panchkarma_category ON panchkarma(category);
CREATE INDEX idx_panchkarma_opd_patient_id ON panchkarma(opd_patient_id);
