-- medicines_vedic.sql
CREATE TABLE IF NOT EXISTS medicines_vedic (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT UNIQUE,                      -- optional stock-keeping code
  name TEXT NOT NULL,                    -- medicine name
  form TEXT,                             -- e.g., Powder, Tablet, Oil
  manufacturer TEXT,
  batch_no TEXT,
  expiry_date DATE,
  unit TEXT DEFAULT 'pcs',               -- e.g., pcs, grams, ml
  unit_price REAL DEFAULT 0.0,
  quantity_in_stock INTEGER DEFAULT 0,
  description TEXT,
  indications TEXT,                      -- short notes / use-cases
  created_by INTEGER,                    -- admin/doctor id (if needed)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medicines_vedic_name ON medicines_vedic (name);
CREATE INDEX IF NOT EXISTS idx_medicines_vedic_batch ON medicines_vedic (batch_no);
CREATE INDEX IF NOT EXISTS idx_medicines_vedic_manufacturer ON medicines_vedic (manufacturer);
