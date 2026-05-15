# Medicine Billing & Draft API Documentation

This document describes the API endpoints for managing medicine bills and drafts.

---

## **Medicine Bills API**

Base URL: `http://localhost:5002/api/medicine-bills`

### **Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create a new medicine bill |
| GET | `/` | Get all medicine bills |
| GET | `/patient/:patientId` | Get all bills for a specific patient |
| GET | `/:id` | Get a single bill by ID |
| PUT | `/:id` | Update a bill |
| DELETE | `/:id` | Delete a bill |

### **Request/Response Examples**

#### Create a Bill
```javascript
// POST /api/medicine-bills/create
{
  "patientId": "P12345",
  "patientName": "John Doe",
  "medicines": [
    { "name": "Ashwagandha", "quantity": 2, "price": 200 },
    { "name": "Triphala", "quantity": 1, "price": 150 }
  ],
  "total": 550,
  "discount": 50,
  "finalTotal": 500,
  "reminderDate": "2025-10-30"
}
```

#### Get All Bills
```javascript
// GET /api/medicine-bills/
// Response: Array of all bills sorted by createdAt (newest first)
```

---

## **Medicine Drafts API**

Base URL: `http://localhost:5002/api/medicine-drafts`

### **Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create a new medicine draft |
| GET | `/` | Get all medicine drafts |
| GET | `/patient/:patientId` | Get all drafts for a specific patient |
| GET | `/:id` | Get a single draft by ID |
| PUT | `/:id` | Update a draft |
| DELETE | `/:id` | Delete a draft |
| POST | `/:id/convert-to-bill` | Convert a draft to a bill (and delete the draft) |

### **Request/Response Examples**

#### Create a Draft
```javascript
// POST /api/medicine-drafts/create
{
  "patientId": "P12345",
  "patientName": "John Doe",
  "medicines": [
    { "name": "Brahmi", "quantity": 1, "price": 300 }
  ],
  "total": 300,
  "discount": 0,
  "finalTotal": 300,
  "reminderDate": "2025-11-01"
}
```

#### Convert Draft to Bill
```javascript
// POST /api/medicine-drafts/:id/convert-to-bill
// Response: { message: 'Draft converted to bill successfully', bill: {...} }
```

---

## **Frontend Integration**

### **Example: Save as Bill**
```javascript
import axios from 'axios';

const saveBill = async (billData) => {
  try {
    const response = await axios.post('http://localhost:5002/api/medicine-bills/create', billData);
    console.log('Bill saved:', response.data);
  } catch (error) {
    console.error('Error saving bill:', error);
  }
};
```

### **Example: Save as Draft**
```javascript
const saveDraft = async (draftData) => {
  try {
    const response = await axios.post('http://localhost:5002/api/medicine-drafts/create', draftData);
    console.log('Draft saved:', response.data);
  } catch (error) {
    console.error('Error saving draft:', error);
  }
};
```

### **Example: Fetch All Bills**
```javascript
const fetchAllBills = async () => {
  try {
    const response = await axios.get('http://localhost:5002/api/medicine-bills/');
    console.log('All bills:', response.data);
  } catch (error) {
    console.error('Error fetching bills:', error);
  }
};
```

---

## **Database Tables**

Make sure you have the following tables in your database:

### **medicine_bills**
- `id` (Primary Key)
- `patientId` (VARCHAR)
- `patientName` (VARCHAR)
- `medicines` (JSON/TEXT)
- `total` (DECIMAL)
- `discount` (DECIMAL)
- `finalTotal` (DECIMAL)
- `reminderDate` (DATE)
- `createdAt` (TIMESTAMP)

### **medicine_drafts**
- Same structure as `medicine_bills`

---

## **Notes**

- The `medicines` field is stored as a JSON string in the database.
- When converting a draft to a bill, the draft is automatically deleted.
- All endpoints return proper HTTP status codes (200, 201, 400, 404, 500).
