# 🚀 Patient Import - Deployment Guide for Render

## 📋 Changes Made

### Backend Files Modified:

1. **`routes/patientroutes.js`**
   - ✅ Fixed route order (moved `/import` before `/:id`)
   - Prevents 404 error when posting to `/import`

2. **`controller/patientcontroller.js`**
   - ✅ Added camelCase to snake_case conversion
   - Maps frontend fields (patientId, primaryTreatment) to database fields (patient_id, primary_treatment)
   - Handles all new fields: state, dateOfBirth, bloodGroup, medicalHistory, allergies, currentMedication

3. **`DB/patients.sql`**
   - ✅ Updated schema with new columns:
     - state
     - date_of_birth
     - blood_group
     - medical_history
     - allergies
     - current_medication

4. **`migrate-patient-table.js`** (NEW)
   - ✅ Migration script to update existing database

---

## 🔧 Deployment Steps

### Step 1: Run Migration (IMPORTANT - Do this FIRST!)

Before deploying to Render, update your local/production database:

```bash
cd "e:\shatayu software\backend"
node migrate-patient-table.js
```

**Expected output:**
```
Starting patient table migration...
✓ Executed: ALTER TABLE patients ADD COLUMN state TEXT;
✓ Executed: ALTER TABLE patients ADD COLUMN date_of_birth DATE;
...
✅ Migration completed successfully!
```

### Step 2: Test Locally (Optional but Recommended)

```bash
# 1. Start backend
cd "e:\shatayu software\backend"
npm start

# 2. Update frontend to use local URL temporarily
# In PatientList.jsx, change:
# const API_URL = 'http://localhost:5002/api/patients';

# 3. Test import with sample CSV
# 4. Verify data appears and persists
```

### Step 3: Commit Changes to Git

```bash
cd "e:\shatayu software\backend"
git add .
git commit -m "Fix patient import: update route order and add field mapping"
git push origin main
```

### Step 4: Deploy to Render

#### Option A: Automatic Deploy (if enabled)
Render will automatically deploy when you push to main branch.

#### Option B: Manual Deploy
1. Go to https://dashboard.render.com
2. Find your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

### Step 5: Run Migration on Render Database

After deployment, you need to update the Render database:

**Option 1: Via Render Shell**
```bash
# In Render dashboard:
# 1. Go to your service
# 2. Click "Shell" tab
# 3. Run:
node migrate-patient-table.js
```

**Option 2: Via Database Client**
Connect to your Render database and run these SQL commands:

```sql
ALTER TABLE patients ADD COLUMN state TEXT;
ALTER TABLE patients ADD COLUMN date_of_birth DATE;
ALTER TABLE patients ADD COLUMN blood_group TEXT;
ALTER TABLE patients ADD COLUMN medical_history TEXT;
ALTER TABLE patients ADD COLUMN allergies TEXT;
ALTER TABLE patients ADD COLUMN current_medication TEXT;
```

### Step 6: Verify Deployment

1. Wait for Render deployment to complete (check Logs tab)
2. In your frontend, keep production URL:
   ```javascript
   const API_URL = 'https://shatayu-backend.onrender.com/api/patients';
   ```
3. Test import:
   - Upload `sample-patient-import.csv`
   - Should see: **Successfully Imported: 20**
   - Verify data persists after page refresh

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend deployed successfully on Render
- [ ] Migration ran without errors
- [ ] Frontend can fetch patients (GET /api/patients works)
- [ ] Import endpoint works (POST /api/patients/import returns 201)
- [ ] Imported data appears in patient table
- [ ] All fields are populated (no "/" or "-")
- [ ] Data persists after page refresh
- [ ] City, State, Country columns show correct data

---

## 🐛 Troubleshooting

### Issue: Still Getting 404 on /import

**Check:**
1. Route order in `patientroutes.js` - `/import` must be before `/:id`
2. Render deployment completed successfully
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

**Fix:**
```bash
# Verify in Render logs that new code is deployed
# Look for: "Server running on port..."
```

### Issue: Import Succeeds but Data Not in Database

**Check:**
1. Migration ran successfully
2. Database has new columns (state, date_of_birth, etc.)
3. Backend logs for SQL errors

**Fix:**
```bash
# Re-run migration script
node migrate-patient-table.js
```

### Issue: Some Fields Still Empty

**Check:**
1. CSV file has correct column headers
2. Field mapping in `mapRowToPatient` includes the field
3. Controller conversion includes the field

**Fix:**
Add missing field to controller:
```javascript
field_name: patient.fieldName || null,
```

---

## 📊 Expected Results

### Before Fix:
```
Import Summary:
❌ Failed: 20
⚠️ 404 errors on all requests
```

### After Fix:
```
Import Summary:
✅ Successfully Imported: 20
❌ Failed: 0
⚠️ Skipped: 0
ℹ️ Total Rows: 20
```

### Patient Table:
| Name | Phone | City | State | Country | Status |
|------|-------|------|-------|---------|--------|
| Rajesh Kumar | 9876543210 | Bangalore | Karnataka | India | active |
| Priya Sharma | 9876543211 | Mumbai | Maharashtra | India | active |
| ... | ... | ... | ... | ... | ... |

---

## 🔄 Quick Deploy Commands

```bash
# Complete deployment workflow:

# 1. Migrate local database
cd "e:\shatayu software\backend"
node migrate-patient-table.js

# 2. Commit and push
git add .
git commit -m "Fix patient import with field mapping and route order"
git push origin main

# 3. Wait for Render auto-deploy (or trigger manual deploy)

# 4. Run migration on Render (via Shell or DB client)

# 5. Test frontend import
```

---

## 📝 Files Changed Summary

```
backend/
├── routes/patientroutes.js          ✏️ Modified (route order)
├── controller/patientcontroller.js  ✏️ Modified (field mapping)
├── DB/patients.sql                  ✏️ Modified (schema)
└── migrate-patient-table.js         ✨ NEW (migration script)
```

---

## 🎯 Success Criteria

✅ All 20 sample patients import successfully  
✅ No 404 errors  
✅ All fields populated correctly  
✅ Data persists after refresh  
✅ No "/" or "-" placeholder characters  
✅ City, State, Country data visible  

---

**Ready to deploy!** Follow the steps above and patient import will work perfectly on production. 🚀
