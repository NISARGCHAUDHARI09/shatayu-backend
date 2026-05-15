-- SQL schema for Billing Management
CREATE TABLE billing (
	id VARCHAR(20) PRIMARY KEY,
	invoice_id VARCHAR(20) NOT NULL,
	patient_name VARCHAR(100) NOT NULL,
	patient_id VARCHAR(20) NOT NULL,
	phone VARCHAR(20),
	date DATE,
	services JSON,
	amount DECIMAL(10,2) NOT NULL,
	paid DECIMAL(10,2) DEFAULT 0,
	status VARCHAR(20),
	payment_method VARCHAR(30),
	due_date DATE,
	prakriti VARCHAR(50),
	address VARCHAR(255),
	notes VARCHAR(255)
);

-- Indexes for reporting and search
CREATE INDEX idx_billing_patient_id ON billing(patient_id);
CREATE INDEX idx_billing_status ON billing(status);
CREATE INDEX idx_billing_date ON billing(date);
