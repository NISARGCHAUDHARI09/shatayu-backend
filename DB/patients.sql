-- Table: patients
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id TEXT UNIQUE NOT NULL,              -- e.g., AYU001
  name TEXT NOT NULL,
  age INTEGER CHECK(age > 0),
  gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  date_of_birth DATE,
  blood_group TEXT,
  constitution TEXT,                            -- e.g., Vata, Pitta, Tridosha
  primary_treatment TEXT,                       -- e.g., Panchakarma
  patient_type TEXT CHECK(patient_type IN ('OPD', 'IPD')),
  status TEXT CHECK(status IN ('active', 'admitted', 'discharged')) DEFAULT 'active',
  last_visit DATE,
  next_appointment DATE,
  emergency_contact TEXT,
  medical_history TEXT,
  allergies TEXT,
  current_medication TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster search (by name, patient_id, phone)
CREATE INDEX IF NOT EXISTS idx_patients_search ON patients (name, patient_id, phone);
