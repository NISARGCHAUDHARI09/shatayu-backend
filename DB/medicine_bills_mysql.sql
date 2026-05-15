-- MySQL schema for medicine bills and drafts

-- MEDICINE BILLS TABLE
CREATE TABLE IF NOT EXISTS medicine_bills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(50),
    patient_name VARCHAR(100) NOT NULL,
    patient_age INT,
    patient_gender VARCHAR(10),
    case_id VARCHAR(50),
    doctor_id INT,
    doctor_name VARCHAR(100),
    medicines_json TEXT,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    final_total DECIMAL(10,2) DEFAULT 0.00,
    reminder_date DATE,
    status VARCHAR(20) DEFAULT 'finalized',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finalized_at TIMESTAMP NULL,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DRAFT BILLS TABLE
CREATE TABLE IF NOT EXISTS draft_bills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(50),
    patient_name VARCHAR(100) NOT NULL,
    patient_age INT,
    patient_gender VARCHAR(10),
    case_id VARCHAR(50),
    doctor_id INT,
    doctor_name VARCHAR(100),
    medicines_json TEXT,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    final_total DECIMAL(10,2) DEFAULT 0.00,
    reminder_date DATE,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finalized_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
