-- Panchkarma Treatment Plan Table
CREATE TABLE IF NOT EXISTS panchkarma_treatment_plan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,                         -- linked with patients table
  doctor_id INTEGER NOT NULL,                          -- linked with doctors table
  panchkarma_id INTEGER NOT NULL,                      -- linked with panchkarma_master
  subcategory_id INTEGER,                              -- linked with panchkarma_subcategories
  treatment_date DATE NOT NULL,                        -- date of that specific session
  session_number INTEGER DEFAULT 1,                    -- e.g., Day 1, Day 2, etc.
  procedure_details TEXT,                              -- manual procedure notes
  materials_used TEXT,                                 -- e.g., oils, herbs, decoction used
  medicines_json TEXT,                                 -- medicines used during procedure (JSON format)
  therapist_name TEXT,                                 -- if performed by therapist
  duration_minutes INTEGER,                            -- duration of treatment
  cost REAL DEFAULT 0.0,                               -- cost of session
  remarks TEXT,                                        -- doctor notes after treatment
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (panchkarma_id) REFERENCES panchkarma_master(id),
  FOREIGN KEY (subcategory_id) REFERENCES panchkarma_subcategories(id)
);

-- Index for faster search and filtering
CREATE INDEX IF NOT EXISTS idx_panchkarma_treatment_patient ON panchkarma_treatment_plan (patient_id, treatment_date);
CREATE INDEX IF NOT EXISTS idx_panchkarma_treatment_doctor ON panchkarma_treatment_plan (doctor_id);