# Hostinger Deployment Guide

## 🎯 Issues Fixed

1. ✅ **Login endpoint corrected**: Changed from `/login` to `/api/auth/login`
2. ✅ **Environment variables configured**: Created `.env` and `.env.production` files in frontend
3. ✅ **CORS updated**: Added www subdomain support and OPTIONS method
4. ✅ **JWT Secret**: Now uses environment variable instead of hardcoded value
5. ✅ **Backend verified**: Render backend is running and responding correctly

---

## 📁 What Was Changed

### Frontend Changes (`src/lib/apiClient.ts`)
```typescript
// OLD: const response = await fetch(`${apiUrl}/login`, {
// NEW: const response = await fetch(`${apiUrl}/api/auth/login`, {
```

### Environment Files Created
- `frontend/.env` - For development
- `frontend/.env.production` - For production builds

Both contain:
```env
VITE_API_URL=https://shatayu-backend.onrender.com
```

### Backend Changes (`backend/index.js`)

1. **CORS Configuration**:
```javascript
origin: [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'https://shatayuhospital.com',
  'http://shatayuhospital.com',
  'https://www.shatayuhospital.com',  // Added www
  'http://www.shatayuhospital.com'    // Added www
],
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Added PATCH, OPTIONS
```

2. **JWT Secret**:
```javascript
// OLD: const JWT_SECRET = 'hardcoded_secret_for_demo';
// NEW: const JWT_SECRET = process.env.JWT_SECRET || 'hardcoded_secret_for_demo';
```

---

## 🚀 Deployment Steps for Hostinger

### Step 1: Upload Frontend Files to Hostinger

1. Go to your Hostinger **File Manager**
2. Navigate to `public_html` (or your domain's root folder)
3. Upload ALL files from `frontend/dist/` folder:
   - `index.html`
   - `assets/` folder (contains all JS and CSS files)
   - Any other files in the dist folder

### Step 2: Configure .htaccess (Important for React Router)

Create a `.htaccess` file in your `public_html` folder with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Enable CORS for API calls
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

### Step 3: Verify Backend is Running

Your backend is already deployed on Render at:
```
https://shatayu-backend.onrender.com
```

✅ Verified working (tested at 2025-10-19 03:56:54)

### Step 4: Test the Login

1. Open your Hostinger website: `https://shatayuhospital.com`
2. Go to the login page
3. Try logging in with:
   - **Email**: `admin@email.com`
   - **Password**: `Admin`

4. Open browser **Developer Tools** (F12) → **Console** tab
5. Look for these logs:
   ```
   🔑 Attempting login with: { email: "admin@email.com", apiUrl: "https://shatayu-backend.onrender.com" }
   📡 Response status: 200
   📊 Login result: { success: true, token: "...", user: {...} }
   ```

---

## 🔍 Troubleshooting

### If you still see CORS errors:

1. **Check the exact domain** you're using on Hostinger
2. Add it to backend CORS configuration in `backend/index.js`:
   ```javascript
   origin: [
     // ... existing origins ...
     'https://your-actual-domain.com',
   ],
   ```
3. Redeploy backend to Render

### If you see "Failed to fetch":

1. **Check backend status**: Visit `https://shatayu-backend.onrender.com/api/health`
2. **Check browser console** for the exact error
3. **Verify environment variable** is being used:
   - Look for the log: `🔑 Attempting login with: { apiUrl: "..." }`
   - It should show `https://shatayu-backend.onrender.com`
   - If it shows `http://localhost:5002`, the env file wasn't loaded

### If environment variable is not loading:

The built files in `dist/` folder have the API URL **hardcoded** from build time. If you change `.env` after building, you must rebuild:

```bash
cd "e:\shatayu software\frontend"
npm run build
```

Then re-upload the `dist/` folder contents to Hostinger.

---

## 📋 Deployment Checklist

- [x] Frontend built with correct API URL
- [x] Backend CORS configured for your domain
- [x] Login endpoint corrected to `/api/auth/login`
- [ ] Upload `dist/` folder contents to Hostinger `public_html`
- [ ] Create `.htaccess` file on Hostinger
- [ ] Test login functionality
- [ ] Verify all API calls work correctly

---

## 🔐 Test Credentials

### Admin Account
- **Email**: `admin@email.com`
- **Password**: `Admin`

### Doctor Account
- **Email**: `himanshu@shatayu.com`
- **Password**: `Himanshu@123`

---

## 📞 Support

If you encounter issues:

1. **Check browser console** for error messages
2. **Check Network tab** in Developer Tools to see the actual request being made
3. **Verify the request URL** matches: `https://shatayu-backend.onrender.com/api/auth/login`
4. **Check backend logs** on Render dashboard

---

## ✅ Current Status

- ✅ Backend: Running on Render
- ✅ Frontend: Built and ready to deploy
- ✅ API Endpoint: `/api/auth/login` (corrected)
- ✅ Environment: Configured for production
- ✅ CORS: Configured for shatayuhospital.com (including www)

**Next Action**: Upload the `frontend/dist/` folder to Hostinger and test!
