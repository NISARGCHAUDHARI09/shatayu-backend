CREATE TABLE users (
  id TEXT PRIMARY KEY,             -- UUID ya koi unique ID
  email TEXT UNIQUE NOT NULL,      -- Login ke liye email
  password TEXT NOT NULL,          -- Hashed password (JWT ke liye)
  role TEXT NOT NULL,              -- doctor / admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
