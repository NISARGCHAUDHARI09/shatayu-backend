# Quick Reference: Medicine Number Migration

## 🚀 Fastest Way (One Command)

```bash
cd backend
npm run add-medicine-number
```

That's it! ✅

---

## 📋 What This Does

- ✅ Adds `medicine_number` column to medicine tables
- ✅ Handles existing columns gracefully
- ✅ Works with Cloudflare D1 database
- ✅ Shows clear success/error messages

---

## ✨ Alternative Methods

### Using Wrangler CLI:
```bash
npx wrangler d1 execute shatayu_hospital_db --remote --file=add-medicine-number.sql
```

### Manual Node Script:
```bash
node add-medicine-number-column.js
```

---

## 📊 Medicine Number Format

**Vedic Medicines:**  
`VED-001`, `VED-002`, `VED-003`

**Custom Medicines:**  
`CUST-001`, `CUST-002`, `CUST-003`

---

## ✅ Verify It Worked

Check your frontend:
1. Go to Medicine Management
2. Click "Add Medicine"
3. You should see "Medicine Number" field
4. Export data - first column should be "Medicine Number"

---

## 📚 Full Documentation

See [MEDICINE_NUMBER_MIGRATION_GUIDE.md](MEDICINE_NUMBER_MIGRATION_GUIDE.md) for complete details.

---

## ⚠️ Troubleshooting

**"Cannot connect to database"**  
→ Check your `.env` file and Cloudflare credentials

**"Table doesn't exist"**  
→ Create your medicine tables first

**"Column already exists"**  
→ Migration already successful! ✅

---

## 🆘 Need Help?

1. Read the error message
2. Check [MEDICINE_NUMBER_MIGRATION_GUIDE.md](MEDICINE_NUMBER_MIGRATION_GUIDE.md)
3. Verify database connection settings
