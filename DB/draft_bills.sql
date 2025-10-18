-- DRAFT BILLS TABLE
CREATE TABLE IF NOT EXISTS draft_bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,                       -- linked to patients table
    patient_name TEXT NOT NULL,
    patient_age INTEGER,
    patient_gender TEXT,
    case_id TEXT,
    doctor_id INTEGER,                        -- linked to doctors table
    doctor_name TEXT,
    medicines_json TEXT,                      -- store medicines as JSON string
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'sent_to_pharmacy')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    finalized_at DATETIME,
    sent_at DATETIME,
    total_amount REAL DEFAULT 0.0,

    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);
