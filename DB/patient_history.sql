-- Patient History View (auto combined data from multiple modules)
CREATE VIEW IF NOT EXISTS patient_history AS
SELECT
  p.id AS patient_id,
  p.name AS patient_name,
  'OPD Visit' AS record_type,
  o.visit_date AS record_date,
  o.diagnosis AS details,
  NULL AS procedure,
  NULL AS medicines,
  o.doctor_id,
  d.name AS doctor_name
FROM opd_records o
JOIN patients p ON p.id = o.patient_id
JOIN doctors d ON d.id = o.doctor_id

UNION ALL

SELECT
  p.id AS patient_id,
  p.name AS patient_name,
  'Panchkarma Treatment' AS record_type,
  t.treatment_date AS record_date,
  pm.name AS details,
  ps.name AS procedure,
  t.medicines_json AS medicines,
  t.doctor_id,
  d.name AS doctor_name
FROM panchkarma_treatment_plan t
JOIN patients p ON p.id = t.patient_id
JOIN doctors d ON d.id = t.doctor_id
JOIN panchkarma_master pm ON pm.id = t.panchkarma_id
LEFT JOIN panchkarma_subcategories ps ON ps.id = t.subcategory_id

UNION ALL

SELECT
  p.id AS patient_id,
  p.name AS patient_name,
  'Prescription' AS record_type,
  b.created_at AS record_date,
  'Medicine Prescription' AS details,
  NULL AS procedure,
  b.medicines_json AS medicines,
  b.doctor_id,
  d.name AS doctor_name
FROM draft_bills b
JOIN patients p ON p.id = b.patient_id
JOIN doctors d ON d.id = b.doctor_id;
