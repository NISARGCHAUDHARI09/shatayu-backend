# JWT Authentication - Quick Start Guide

## ✅ What's Working

### Backend (http://localhost:5002)
- ✅ SQLite database initialized with users, medicine_bills, and draft_bills tables
- ✅ JWT authentication system
- ✅ Protected API routes
- ✅ Admin user created

### Frontend (http://localhost:5173)
- ✅ AuthContext integrated with real API
- ✅ Login page connected to backend
- ✅ Automatic JWT token management
- ✅ API utility for authenticated requests

## 🔐 Test Credentials

**Admin Account:**
- Email: `nkdev0902@gmail.com`
- Password: `Admin`

## 🚀 Quick Test

### 1. Start Backend (Already Running ✅)
```bash
cd backend
node index.js
# Server on http://localhost:5002
```

### 2. Start Frontend
```bash
npm run dev
# Frontend on http://localhost:5173
```

### 3. Login
1. Go to http://localhost:5173/login
2. Enter admin credentials
3. Redirects to /admin/dashboard

## 📝 API Examples

### Login
```javascript
POST http://localhost:5002/api/auth/login
Content-Type: application/json

{
  "email": "nkdev0902@gmail.com",
  "password": "Admin"
}

// Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "nkdev0902@gmail.com",
    "name": "nisarg",
    "role": "admin"
  }
}
```

### Access Protected Route
```javascript
GET http://localhost:5002/api/medicine-bills/
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Response: {} or list of bills
```

## 🎯 Frontend Usage

### In React Components:
```javascript
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

function MyComponent() {
  const { user, logout } = useAuth();
  
  // Get bills (JWT automatically included)
  const fetchBills = async () => {
    const bills = await api.get('/medicine-bills');
    console.log(bills);
  };
  
  // Create bill
  const createBill = async () => {
    await api.post('/medicine-bills/create', {
      patient_name: 'John Doe',
      medicines_json: '[]',
      total_amount: 1000
    });
  };
  
  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## ✅ Verification Tests

### Test 1: Login Works ✅
```powershell
$body = @{email='nkdev0902@gmail.com';password='Admin'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:5002/api/auth/login' -Method POST -Body $body -ContentType 'application/json'

# Returns: token and user info
```

### Test 2: Protected Route (No Token) ✅
```powershell
Invoke-WebRequest -Uri 'http://localhost:5002/api/medicine-bills/' -Method GET

# Returns: 401 {"error":"Access token required"}
```

### Test 3: Protected Route (With Token) ✅
```powershell
$headers = @{Authorization='Bearer YOUR_TOKEN_HERE'}
Invoke-WebRequest -Uri 'http://localhost:5002/api/medicine-bills/' -Method GET -Headers $headers

# Returns: {} or list of bills
```

## 📁 Key Files

### Backend
- `backend/config/database.js` - Database connection
- `backend/controller/authcontroller.js` - Login logic
- `backend/middleware/authMiddleware.js` - JWT verification
- `backend/routes/authroutes.js` - Auth endpoints
- `backend/routes/medicinebillroutes.js` - Protected bill routes
- `backend/routes/medicinedraftroutes.js` - Protected draft routes

### Frontend
- `src/contexts/AuthContext.tsx` - Auth state & login
- `src/utils/api.js` - API requests with JWT
- `src/pages/Login.jsx` - Login UI

## 🔄 User Flow

1. User enters credentials on login page
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials, generates JWT
4. Frontend stores JWT in localStorage
5. All subsequent API calls include JWT in Authorization header
6. Backend verifies JWT on protected routes
7. If JWT invalid/expired → redirect to login

## 🎉 Ready to Use!

Your JWT authentication system is fully integrated and tested. You can now:
- Login with admin credentials
- Access protected routes
- Create/manage bills and drafts
- Add more users via admin panel

**Next:** Integrate this authentication with your existing components (AdminDashboard, BillingManagement, etc.)
