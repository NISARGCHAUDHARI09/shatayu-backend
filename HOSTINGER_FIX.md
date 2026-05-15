# Hostinger 404 Error Fix Guide

## 🚨 Current Issue
- Getting 404 error when accessing the site
- Login not working
- Page reload shows 404 error

## 🔍 Root Causes
1. **Missing `.htaccess` file** - React Router needs URL rewriting
2. **Incorrect file upload** - dist folder contents not properly uploaded
3. **CORS issues** - Backend might be blocking requests from your domain

---

## ✅ Step-by-Step Fix

### Step 1: Create `.htaccess` File

**Location**: `public_html/.htaccess` on Hostinger

**Content**:
```apache
# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Serve existing files directly
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  
  # Route all other requests to index.html
  RewriteRule . /index.html [L]
</IfModule>

# Prevent directory browsing
Options -Indexes

# Set default charset
AddDefaultCharset UTF-8

# Enable CORS for API calls (if needed)
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

### Step 2: Upload Files to Hostinger

**Important**: Upload files from `E:\shatayu software\frontend\dist\` folder

1. **Login to Hostinger** → Go to **File Manager**
2. **Navigate to** `public_html` folder
3. **Delete** all existing files in `public_html` (if any)
4. **Upload these files**:
   ```
   dist/
   ├── index.html          (MUST upload)
   ├── assets/             (MUST upload entire folder)
   │   ├── index-DKd3nLCO.css
   │   ├── index-DO4obtZP.js
   │   ├── index.es-y2iZzSCt.js
   │   ├── html2canvas.esm-B0tyYwQk.js
   │   └── purify.es-B6FQ9oRL.js
   └── .htaccess           (Create this manually)
   ```

5. **File Structure** in `public_html` should look like:
   ```
   public_html/
   ├── .htaccess           ← CREATE THIS
   ├── index.html          ← FROM dist/
   └── assets/             ← FROM dist/
       ├── index-DKd3nLCO.css
       ├── index-DO4obtZP.js
       ├── index.es-y2iZzSCt.js
       ├── html2canvas.esm-B0tyYwQk.js
       └── purify.es-B6FQ9oRL.js
   ```

### Step 3: Verify Upload

1. **Check index.html** exists at: `https://shatayuhospital.com/index.html`
2. **Check assets folder** exists: `https://shatayuhospital.com/assets/`
3. **Test main page**: `https://shatayuhospital.com/`

### Step 4: Test Backend Connection

Open browser console (F12) and run:

```javascript
fetch('https://shatayu-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend working:', d))
  .catch(e => console.error('❌ Backend error:', e))
```

Should return:
```json
{
  "status": "OK",
  "message": "Hospital Management System API is running",
  "timestamp": "2025-10-19T..."
}
```

### Step 5: Test Login

1. Go to: `https://shatayuhospital.com/`
2. Click Login
3. Enter credentials:
   - **Email**: `admin@email.com`
   - **Password**: `Admin`
4. Check browser console for errors

---

## 🔧 Troubleshooting

### Problem: Still getting 404

**Check 1**: Is `.htaccess` file in the **root** of `public_html`?
```
public_html/.htaccess  ✅ CORRECT
public_html/assets/.htaccess  ❌ WRONG
```

**Check 2**: File permissions
- `.htaccess` should be `644`
- `index.html` should be `644`
- `assets/` folder should be `755`

**Check 3**: Check Hostinger Apache settings
- Make sure `mod_rewrite` is enabled
- Contact Hostinger support if needed

### Problem: Login shows CORS error

**Fix**: Update backend CORS on Render:

1. Check if your exact domain is in the CORS list
2. Add both `http` and `https` versions:
   ```javascript
   origin: [
     'https://shatayuhospital.com',
     'http://shatayuhospital.com',
     'https://www.shatayuhospital.com',
     'http://www.shatayuhospital.com'
   ]
   ```

### Problem: Login shows "Failed to fetch"

**Possible causes**:
1. Backend is down on Render
2. API URL is wrong in frontend
3. CORS blocking the request

**Check**:
```bash
# Test backend directly
curl https://shatayu-backend.onrender.com/api/health

# Should return JSON with status "OK"
```

### Problem: Blank page after login

**Check**:
1. Browser console for JavaScript errors
2. Network tab for failed API calls
3. Make sure all routes are properly configured

---

## 📝 Quick Checklist

Before asking for help, verify:

- [ ] `.htaccess` file created in `public_html/` folder
- [ ] `index.html` exists in `public_html/` folder
- [ ] `assets/` folder exists in `public_html/` folder
- [ ] Can access `https://shatayuhospital.com/index.html` directly
- [ ] Can access `https://shatayuhospital.com/assets/index-DO4obtZP.js` directly
- [ ] Backend health check returns 200: `https://shatayu-backend.onrender.com/api/health`
- [ ] Browser console shows no CORS errors
- [ ] No 404 errors in Network tab

---

## 🎯 Expected Results

After fixing:

1. **Homepage loads**: `https://shatayuhospital.com/` shows login page
2. **Refresh works**: Pressing F5 doesn't show 404
3. **Login works**: Can login with admin credentials
4. **Navigation works**: Can navigate between pages
5. **No console errors**: Clean browser console

---

## 📞 If Still Not Working

**Collect this information**:

1. Screenshot of browser console (F12 → Console tab)
2. Screenshot of Network tab showing failed requests
3. Screenshot of Hostinger File Manager showing file structure
4. URL where you're seeing the 404 error

**Test URLs to share**:
- Your site: `https://shatayuhospital.com/`
- Backend health: `https://shatayu-backend.onrender.com/api/health`
- index.html direct: `https://shatayuhospital.com/index.html`
- assets direct: `https://shatayuhospital.com/assets/index-DO4obtZP.js`

---

## 🚀 Alternative: Using Hostinger's Built-in Tools

If `.htaccess` doesn't work, you can also:

1. **Enable Single Page Application mode** in Hostinger settings
2. **Use Hostinger's Application Manager** to deploy React apps
3. **Contact Hostinger support** to enable URL rewriting

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Homepage loads without errors
2. ✅ Refreshing any page doesn't show 404
3. ✅ Login form submits successfully
4. ✅ Console shows: `🔑 Attempting login with: { email: "admin@email.com", apiUrl: "https://shatayu-backend.onrender.com" }`
5. ✅ Console shows: `📡 Response status: 200`
6. ✅ Console shows: `📊 Login result: { success: true, ... }`
7. ✅ Redirects to dashboard after login
