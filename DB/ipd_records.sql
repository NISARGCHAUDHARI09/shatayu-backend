-- SQL schema for IPD records based on IPD.jsx
CREATE TABLE ipd_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_no VARCHAR(20) NOT NULL,
    case_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    phone VARCHAR(20),
    admission_date DATE,
    room VARCHAR(50),
    doctor VARCHAR(100),
    condition VARCHAR(100),
    prakriti VARCHAR(50),
    dosha VARCHAR(50),
    ayurvedic_diagnosis VARCHAR(255),
    therapy VARCHAR(255),
    panchakarma VARCHAR(255),
    treatment_duration INT,
    diet VARCHAR(255),
    yoga VARCHAR(255),
    status VARCHAR(30),
    -- JSON columns for complex structures
    panchkarmas JSON,
    progress_notes JSON,
    medicines JSON
);

-- Indexes for search
CREATE INDEX idx_ipd_case_id ON ipd_records(case_id);
CREATE INDEX idx_ipd_reg_no ON ipd_records(reg_no);
CREATE INDEX idx_ipd_name ON ipd_records(name);
CREATE INDEX idx_ipd_status ON ipd_records(status);
