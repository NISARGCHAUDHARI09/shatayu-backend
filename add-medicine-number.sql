-- SQL Migration Script: Add medicine_number column to medicine tables
-- Run this script if you need to manually execute SQL commands

-- For Cloudflare D1 Database (use wrangler d1 execute)
-- Correct table names: medicines_vedic and medicines_custom

-- 1. Add medicine_number column to medicines_vedic table
ALTER TABLE medicines_vedic ADD COLUMN medicine_number TEXT;

-- 2. Add medicine_number column to medicines_custom table
ALTER TABLE medicines_custom ADD COLUMN medicine_number TEXT;

-- Create indexes for faster lookups by medicine_number
CREATE INDEX IF NOT EXISTS idx_medicines_vedic_medicine_number ON medicines_vedic(medicine_number);
CREATE INDEX IF NOT EXISTS idx_medicines_custom_medicine_number ON medicines_custom(medicine_number);

-- Optional: Add unique constraints if you want medicine_number to be unique within each table
-- Uncomment these lines if needed:
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_medicines_vedic_medicine_number_unique ON medicines_vedic(medicine_number);
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_medicines_custom_medicine_number_unique ON medicines_custom(medicine_number);
