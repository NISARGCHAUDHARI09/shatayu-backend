-- Panchkarma Master Table
CREATE TABLE IF NOT EXISTS panchkarma_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE,                           -- e.g., PK001
  name TEXT NOT NULL,                         -- Panchkarma name (e.g., Vamana, Virechana)
  category TEXT,                              -- e.g., Poorvakarma, Pradhanakarma, Paschatkarma
  description TEXT,                           -- overview of the procedure
  indication TEXT,                            -- when this therapy is advised
  contraindication TEXT,                      -- when this therapy should be avoided
  benefits TEXT,                              -- health benefits / outcomes
  duration_days INTEGER DEFAULT 1,            -- general duration
  duration_minutes INTEGER,                   -- single session duration
  cost REAL DEFAULT 0.0,
  created_by INTEGER,                         -- admin/doctor id who added it
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast searching by name/category
CREATE INDEX IF NOT EXISTS idx_panchkarma_name_category ON panchkarma_master (name, category);

