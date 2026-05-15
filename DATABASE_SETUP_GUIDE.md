# Database Setup Guide for Medicine Bills & Drafts

## 📋 Prerequisites

1. **MySQL Server** must be installed and running on your machine
2. **Database created** - You need a database (e.g., `hospital_db`)
3. **User credentials** - MySQL username and password

---

## 🔧 Step 1: Configure Database Connection

Edit `backend/config/database.js` or set environment variables:

### Option A: Environment Variables (Recommended)
Create a `.env` file in the `backend` folder:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=hospital_db
```

### Option B: Direct Configuration
Edit `backend/config/database.js`:
```javascript
export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',              // <-- Your MySQL username
  password: 'your_password',  // <-- Your MySQL password
  database: 'hospital_db',    // <-- Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

---

## 🗄️ Step 2: Create Database Tables

### Automatic Setup (Easy Way)
Run the initialization script:
```bash
cd backend
npm run init-db
```

This will automatically create both tables:
- `medicine_bills`
- `draft_bills`

### Manual Setup (Alternative)
If you prefer to create tables manually:

```sql
-- Create medicine_bills table
CREATE TABLE IF NOT EXISTS medicine_bills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(50),
    patient_name VARCHAR(100) NOT NULL,
    patient_age INT,
    patient_gender VARCHAR(10),
    case_id VARCHAR(50),
    doctor_id INT,
    doctor_name VARCHAR(100),
    medicines_json TEXT,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    final_total DECIMAL(10,2) DEFAULT 0.00,
    reminder_date DATE,
    status VARCHAR(20) DEFAULT 'finalized',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finalized_at TIMESTAMP NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create draft_bills table
CREATE TABLE IF NOT EXISTS draft_bills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(50),
    patient_name VARCHAR(100) NOT NULL,
    patient_age INT,
    patient_gender VARCHAR(10),
    case_id VARCHAR(50),
    doctor_id INT,
    doctor_name VARCHAR(100),
    medicines_json TEXT,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    final_total DECIMAL(10,2) DEFAULT 0.00,
    reminder_date DATE,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finalized_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🚀 Step 3: Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Backend server running on port 5002
```

---

## ✅ Step 4: Test the API Endpoints

### Test Medicine Bills
```bash
# Get all bills
curl http://localhost:5002/api/medicine-bills/

# Create a bill
curl -X POST http://localhost:5002/api/medicine-bills/create \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "P001",
    "patientName": "John Doe",
    "medicines": [
      {"name": "Ashwagandha", "quantity": 2, "price": 200}
    ],
    "total": 400,
    "discount": 50,
    "finalTotal": 350
  }'
```

### Test Medicine Drafts
```bash
# Get all drafts
curl http://localhost:5002/api/medicine-drafts/

# Create a draft
curl -X POST http://localhost:5002/api/medicine-drafts/create \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "P002",
    "patientName": "Jane Smith",
    "medicines": [
      {"name": "Brahmi", "quantity": 1, "price": 300}
    ],
    "total": 300,
    "discount": 0,
    "finalTotal": 300
  }'
```

---

## 🔍 Verify Database

Connect to MySQL and check the tables:
```sql
USE hospital_db;

-- Check medicine_bills table
SELECT * FROM medicine_bills;

-- Check draft_bills table
SELECT * FROM draft_bills;

-- Check table structure
DESCRIBE medicine_bills;
DESCRIBE draft_bills;
```

---

## 📊 Frontend Integration

### Fetch All Bills (for Billing Module)
```javascript
import axios from 'axios';

const fetchAllBills = async () => {
  try {
    const response = await axios.get('http://localhost:5002/api/medicine-bills/');
    console.log('Bills:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching bills:', error);
  }
};
```

### Fetch All Drafts (for Draft Module)
```javascript
const fetchAllDrafts = async () => {
  try {
    const response = await axios.get('http://localhost:5002/api/medicine-drafts/');
    console.log('Drafts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching drafts:', error);
  }
};
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- ✅ Check if MySQL server is running
- ✅ Verify database credentials in `config/database.js`
- ✅ Make sure the database exists

### Error: "Table doesn't exist"
- ✅ Run `npm run init-db` to create tables
- ✅ Or manually create tables using SQL commands above

### Error: "ECONNREFUSED"
- ✅ Make sure backend server is running: `npm start`
- ✅ Check if port 5002 is available

### Error: "Access denied for user"
- ✅ Check MySQL username and password
- ✅ Grant proper permissions to the user

---

## 📁 Files Updated/Created

### Created:
- ✅ `backend/config/database.js` - Database connection pool
- ✅ `backend/DB/medicine_bills_mysql.sql` - MySQL schema
- ✅ `backend/scripts/initDatabase.js` - Auto-initialization script

### Modified:
- ✅ `backend/controller/medicinebillcontroller.js` - Now uses database
- ✅ `backend/controller/medicinedraftcontroller.js` - Now uses database
- ✅ `backend/package.json` - Added `init-db` script

---

## ✨ What Changed

### Before:
- ❌ In-memory storage (data lost on server restart)
- ❌ No persistent data
- ❌ No database connection

### After:
- ✅ MySQL database storage
- ✅ Persistent data
- ✅ Full CRUD operations on database
- ✅ Proper error handling
- ✅ Draft to Bill conversion using transactions

---

**All set! Your medicine billing system is now connected to the database!** 🎉
