-- medicines_custom.sql
CREATE TABLE IF NOT EXISTS medicines_custom (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT UNIQUE,                       -- optional
  name TEXT NOT NULL,
  preparation TEXT,                      -- e.g., churnam, oil, paste
  composition TEXT,                      -- free text / comma separated ingredients
  recipe_json TEXT,                      -- optional: JSON string describing recipe/ratios
  batch_no TEXT,
  expiry_date DATE,
  unit TEXT DEFAULT 'pack',
  unit_price REAL DEFAULT 0.0,
  quantity_in_stock INTEGER DEFAULT 0,
  prepared_by TEXT,                   -- name of staff/doctor who created it
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medicines_custom_name ON medicines_custom (name);
CREATE INDEX IF NOT EXISTS idx_medicines_custom_batch ON medicines_custom (batch_no);
CREATE INDEX IF NOT EXISTS idx_medicines_custom_prepared_by ON medicines_custom (prepared_by);