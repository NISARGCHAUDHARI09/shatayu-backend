-- Migration: Fix or remove invalid foreign key constraints referencing patients
-- Date: 2026-01-07
-- Goal: Allow hard delete of patients without Cloudflare D1 "foreign key mismatch" errors.

BEGIN TRANSACTION;

-- Disable FK checks temporarily while we rebuild tables
PRAGMA foreign_keys = OFF;

-- 1) Rebuild diagnosis table WITHOUT foreign keys
-- Existing schema (for reference):
-- CREATE TABLE IF NOT EXISTS diagnosis (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   patient_id INTEGER NOT NULL,
--   doctor_id INTEGER NOT NULL,
--   diagnosis_text TEXT NOT NULL,
--   notes TEXT,
--   diagnosis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (patient_id) REFERENCES patients(id),
--   FOREIGN KEY (doctor_id) REFERENCES doctors(id)
-- );

CREATE TABLE IF NOT EXISTS diagnosis_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  diagnosis_text TEXT NOT NULL,
  notes TEXT,
  diagnosis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO diagnosis_new (
  id, patient_id, doctor_id, diagnosis_text, notes, diagnosis_date
)
SELECT
  id, patient_id, doctor_id, diagnosis_text, notes, diagnosis_date
FROM diagnosis;

DROP TABLE diagnosis;
ALTER TABLE diagnosis_new RENAME TO diagnosis;

-- 2) Rebuild draft_bills table WITHOUT foreign keys
-- Existing schema (for reference):
-- CREATE TABLE IF NOT EXISTS draft_bills (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   patient_id INTEGER,
--   patient_name TEXT NOT NULL,
--   patient_age INTEGER,
--   patient_gender TEXT,
--   case_id TEXT,
--   doctor_id INTEGER,
--   doctor_name TEXT,
--   medicines_json TEXT,
--   status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'sent_to_pharmacy')),
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--   finalized_at DATETIME,
--   sent_at DATETIME,
--   total_amount REAL DEFAULT 0.0,
--   FOREIGN KEY (doctor_id) REFERENCES doctors(id),
--   FOREIGN KEY (patient_id) REFERENCES patients(id)
-- );

CREATE TABLE IF NOT EXISTS draft_bills_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER,
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  patient_gender TEXT,
  case_id TEXT,
  doctor_id INTEGER,
  doctor_name TEXT,
  medicines_json TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'sent_to_pharmacy')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  finalized_at DATETIME,
  sent_at DATETIME,
  total_amount REAL DEFAULT 0.0
);

INSERT INTO draft_bills_new (
  id, patient_id, patient_name, patient_age, patient_gender,
  case_id, doctor_id, doctor_name, medicines_json,
  status, created_at, finalized_at, sent_at, total_amount
)
SELECT
  id, patient_id, patient_name, patient_age, patient_gender,
  case_id, doctor_id, doctor_name, medicines_json,
  status, created_at, finalized_at, sent_at, total_amount
FROM draft_bills;

DROP TABLE draft_bills;
ALTER TABLE draft_bills_new RENAME TO draft_bills;

-- 3) Rebuild panchkarma_treatment_plan WITHOUT foreign keys
-- Existing schema (for reference): see DB/panchkarma_treatmentplan.sql

CREATE TABLE IF NOT EXISTS panchkarma_treatment_plan_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  panchkarma_id INTEGER NOT NULL,
  subcategory_id INTEGER,
  treatment_date DATE NOT NULL,
  session_number INTEGER DEFAULT 1,
  procedure_details TEXT,
  materials_used TEXT,
  medicines_json TEXT,
  therapist_name TEXT,
  duration_minutes INTEGER,
  cost REAL DEFAULT 0.0,
  remarks TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO panchkarma_treatment_plan_new (
  id, patient_id, doctor_id, panchkarma_id, subcategory_id,
  treatment_date, session_number, procedure_details, materials_used,
  medicines_json, therapist_name, duration_minutes, cost, remarks,
  created_at, updated_at
)
SELECT
  id, patient_id, doctor_id, panchkarma_id, subcategory_id,
  treatment_date, session_number, procedure_details, materials_used,
  medicines_json, therapist_name, duration_minutes, cost, remarks,
  created_at, updated_at
FROM panchkarma_treatment_plan;

DROP TABLE panchkarma_treatment_plan;
ALTER TABLE panchkarma_treatment_plan_new RENAME TO panchkarma_treatment_plan;

-- Re-enable FK checks
PRAGMA foreign_keys = ON;

COMMIT;
