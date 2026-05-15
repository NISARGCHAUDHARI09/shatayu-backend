# Medicine Number Column Migration Guide

## Overview
This guide explains how to add the `medicine_number` column to your medicine management database tables.

---

## What Was Changed in Frontend

✅ **Table Display**: Added "Medicine No." column with color-coded badges
✅ **Add/Edit Form**: Added Medicine Number input field with smart placeholders
✅ **Export (CSV/Excel/PDF)**: Includes Medicine Number as first column
✅ **Import (CSV/Excel)**: Accepts Medicine Number from imported files

---

## Database Migration Options

You have **3 options** to add the `medicine_number` column to your database:

### **Option 1: Using Node.js Migration Script (Recommended)**

#### Step 1: Run the Migration Script
```bash
cd backend
node add-medicine-number-column.js
```

This script will:
- Connect to your Cloudflare D1 database
- Add `medicine_number` column to all medicine tables
- Handle errors gracefully (skip if column already exists)
- Show success/warning messages for each table

#### Expected Output:
```
🔧 Starting medicine_number column migration...
✅ Database connection successful
📝 Adding medicine_number column to tables...
✓ Added medicine_number to vedic_medicines table
✓ Added medicine_number to owned_medicines table
✓ Added medicine_number to custom_medicines table
✅ Migration completed successfully!
```

---

### **Option 2: Using Wrangler CLI (Cloudflare D1)**

If you're using Cloudflare D1, you can run SQL directly using wrangler:

#### Step 1: Open Terminal
```bash
cd backend
```

#### Step 2: Execute SQL for Each Table
```bash
# Add column to vedic_medicines
npx wrangler d1 execute shatayu_hospital_db --remote --command="ALTER TABLE vedic_medicines ADD COLUMN medicine_number TEXT;"

# Add column to owned_medicines
npx wrangler d1 execute shatayu_hospital_db --remote --command="ALTER TABLE owned_medicines ADD COLUMN medicine_number TEXT;"

# Add column to custom_medicines
npx wrangler d1 execute shatayu_hospital_db --remote --command="ALTER TABLE custom_medicines ADD COLUMN medicine_number TEXT;"
```

#### Optional: Add Indexes for Better Performance
```bash
# Create indexes
npx wrangler d1 execute shatayu_hospital_db --remote --command="CREATE INDEX IF NOT EXISTS idx_vedic_medicine_number ON vedic_medicines(medicine_number);"

npx wrangler d1 execute shatayu_hospital_db --remote --command="CREATE INDEX IF NOT EXISTS idx_owned_medicine_number ON owned_medicines(medicine_number);"

npx wrangler d1 execute shatayu_hospital_db --remote --command="CREATE INDEX IF NOT EXISTS idx_custom_medicine_number ON custom_medicines(medicine_number);"
```

---

### **Option 3: Using SQL File (Manual Execution)**

If you prefer to execute SQL manually or use a database management tool:

#### Step 1: Open the SQL File
The SQL file is located at: `backend/add-medicine-number.sql`

#### Step 2: Execute Each Statement
Copy and paste each SQL statement into your database tool or use wrangler:

```bash
npx wrangler d1 execute shatayu_hospital_db --remote --file=add-medicine-number.sql
```

---

## Verify Migration

After running the migration, verify it was successful:

### Check Table Structure (Using Wrangler):
```bash
npx wrangler d1 execute shatayu_hospital_db --remote --command="PRAGMA table_info(vedic_medicines);"
```

You should see `medicine_number` in the column list.

---

## Medicine Number Format Guidelines

### **Suggested Formats:**

#### Vedic Medicines:
- `VED-001`, `VED-002`, `VED-003`, ...
- Or: `V-001`, `AYU-001`, `AYUR-001`, etc.

#### Custom/Owned Medicines:
- `CUST-001`, `CUST-002`, `CUST-003`, ...
- Or: `C-001`, `CUSTOM-001`, `OWN-001`, etc.

### **Format Rules:**
- Keep it consistent across your system
- Use leading zeros for better sorting (001 instead of 1)
- Category prefix helps identify medicine type at a glance
- Maximum recommended length: 20 characters

---

## Using Medicine Numbers in Frontend

### **1. Adding New Medicine:**
- Open Medicine Management
- Click "Add Medicine"
- Fill in the "Medicine Number" field (optional but recommended)
- Save the medicine

### **2. Importing Medicines:**
- Export an empty template (CSV/Excel) to get the correct column structure
- Fill in the "Medicine Number" column along with other data
- Import the file back

### **3. Exporting Medicines:**
- Medicine Number will appear as the first column in all exports
- Use exports to see existing numbering and maintain consistency

---

## Troubleshooting

### Problem: "Table doesn't exist"
**Solution**: Your medicine tables might not be created yet. Create them first or the migration will skip those tables.

### Problem: "Column already exists"
**Solution**: The migration already ran successfully. No action needed.

### Problem: "Connection failed"
**Solution**: 
1. Check your `.env` file has correct Cloudflare credentials
2. Verify `wrangler.toml` has the correct database_id
3. Ensure you're logged in to Cloudflare: `npx wrangler login`

### Problem: "Permission denied"
**Solution**: Make sure you have write access to the Cloudflare D1 database.

---

## Rollback (If Needed)

If you need to remove the medicine_number column:

```bash
# Note: SQLite/D1 doesn't support DROP COLUMN directly
# You'll need to recreate the table without the column
# This is destructive - backup your data first!

# Better approach: Just leave the column empty if not using it
```

---

## Next Steps

1. ✅ Run the migration script (choose one of the 3 options above)
2. ✅ Verify the column was added successfully
3. ✅ Start adding medicine numbers through the frontend
4. ✅ Export a template to see the new column structure
5. ✅ Use consistent numbering format for all new medicines

---

## Support

If you encounter any issues:
1. Check the error message carefully
2. Verify your database connection settings
3. Make sure your Cloudflare credentials are correct
4. Check if the tables exist in your database

---

## Summary

**Quick Start:**
```bash
cd backend
node add-medicine-number-column.js
```

That's it! Your medicine tables now have the medicine_number column and your frontend is ready to use it. 🎉
