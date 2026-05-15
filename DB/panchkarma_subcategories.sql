-- Panchkarma Subcategories Table
CREATE TABLE IF NOT EXISTS panchkarma_subcategories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  panchkarma_id INTEGER NOT NULL,              -- linked with panchkarma_master
  code TEXT UNIQUE,                            -- e.g., PK-S001
  name TEXT NOT NULL,                          -- e.g., Shirodhara, Matra Basti
  description TEXT,
  duration_minutes INTEGER,
  cost REAL DEFAULT 0.0,
  materials_required TEXT,                     -- e.g., medicated oil, decoction, steam setup
  procedure_steps TEXT,                        -- optional: short procedure steps
  created_by INTEGER,                          -- doctor/admin who added
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (panchkarma_id) REFERENCES panchkarma_master(id)
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_panchkarma_sub_name ON panchkarma_subcategories (name);

