-- Table: doctors
CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,                        -- linked with users table (foreign key)
  doctor_code TEXT UNIQUE NOT NULL,             -- e.g., DOC001
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
  specialization TEXT,                           -- e.g., Ayurveda, Panchakarma
  qualification TEXT,                            -- e.g., BAMS, MD (Ayurveda)
  experience INTEGER DEFAULT 0,                  -- in years
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  joining_date DATE DEFAULT CURRENT_DATE,
  status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id)     -- ensures doctor is linked to a valid user
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_doctors_search ON doctors (name, doctor_code, specialization);
