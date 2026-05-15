# Cloudflare D1 Integration Guide

## ✅ What Has Been Set Up

Your backend has been configured to use **Cloudflare D1** as the primary database instead of local SQLite.

### Files Created/Updated:

1. **`backend/config/cloudflare-d1.js`** - Cloudflare D1 database connection
2. **`backend/scripts/initCloudflareD1.js`** - Initialize D1 tables
3. **`backend/scripts/createAdminD1.js`** - Create admin users in D1
4. **`backend/index.js`** - Updated to use Cloudflare D1
5. **`backend/controller/authcontroller.js`** - Updated to use Cloudflare D1
6. **`backend/controller/medicinebillcontroller.js`** - Updated to use Cloudflare D1
7. **`backend/controller/medicinedraftcontroller.js`** - Updated to use Cloudflare D1
8. **`backend/package.json`** - Added new npm scripts

## 🚀 Setup Steps

### Step 1: Verify Your Cloudflare D1 Credentials

Your `.env` file already has the credentials:
```
D1_DATABASE_URL=https://api.cloudflare.com/client/v4/accounts/35a9f32ccdde93858bdc907dab894ea0/d1/database/2b3a4a38-e49d-4ea5-8e34-1dcdab001621
D1_AUTH_TOKEN=oLOwd9Y46gWIrjwlvfyRmoomU9ZVKhbW5MFCs3i7
```

✅ Credentials are already configured!

### Step 2: Initialize Cloudflare D1 Database Tables

Run this command to create the required tables in Cloudflare D1:

```bash
cd backend
npm run init-d1
```

This will create:
- `users` table (for authentication)
- `medicine_bills` table
- `draft_bills` table

### Step 3: Create Your First Admin User in Cloudflare D1

```bash
npm run create-admin-d1
```

You'll be prompted to enter:
- Admin username
- Admin email
- Admin name
- Password

**Example:**
```
Enter admin username: admin
Enter admin email: nkdev0902@gmail.com
Enter admin name: Nisarg
Enter password: YourSecurePassword123
```

### Step 4: Start the Backend Server

```bash
npm start
```

The server will now connect to Cloudflare D1 instead of local SQLite!

### Step 5: Test Login

From the frontend login page:
- Email: (the email you created in Step 3)
- Password: (the password you set in Step 3)

## 📝 Available NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start backend server with Cloudflare D1 |
| `npm run dev` | Start with auto-reload (nodemon) |
| `npm run init-d1` | Initialize Cloudflare D1 tables |
| `npm run create-admin-d1` | Create admin user in Cloudflare D1 |
| `npm run init-db` | Initialize local SQLite (old method) |
| `npm run create-admin` | Create admin in local SQLite (old method) |

## 🔄 What Changed

### Before (Local SQLite):
```javascript
// Used local file: backend/data/hospital.db
import { initDatabase } from './config/database.js';
```

### After (Cloudflare D1):
```javascript
// Uses Cloudflare D1 cloud database
import { initDatabase } from './config/cloudflare-d1.js';
```

## 🎯 Benefits of Cloudflare D1

✅ **Cloud-based**: Data accessible from anywhere
✅ **No local files**: No need for `backend/data/hospital.db`
✅ **Scalable**: Cloudflare's infrastructure
✅ **Production-ready**: Same database for dev and production
✅ **Automatic backups**: Cloudflare handles it

## 🔍 How It Works

1. **User creates account** → Stored directly in Cloudflare D1
2. **User logs in** → Backend queries Cloudflare D1
3. **Bills/Drafts created** → Saved to Cloudflare D1
4. **All data** → Lives in the cloud, not local files

## 🧪 Testing the Connection

```bash
cd backend
node -e "import('./config/cloudflare-d1.js').then(async (db) => { await db.initDatabase(); await db.testConnection(); process.exit(0); })"
```

Expected output:
```
✅ Connected to Cloudflare D1 database
✅ Cloudflare D1 connection successful
```

## ⚠️ Important Notes

1. **Environment Variables Required**: Make sure your `.env` file has valid D1 credentials
2. **Run init-d1 First**: Before creating users, initialize the tables
3. **No More Local DB**: The old `backend/data/hospital.db` file is no longer used
4. **Same API**: Frontend doesn't need any changes - same endpoints work

## 🐛 Troubleshooting

### Error: "Cloudflare D1 credentials not found"
**Solution**: Check your `.env` file has `D1_DATABASE_URL` and `D1_AUTH_TOKEN`

### Error: "Cannot initialize database: connection failed"
**Solution**: Verify your Cloudflare D1 credentials are correct

### Error: "UNIQUE constraint failed"
**Solution**: User with that email already exists in D1

### Login shows "wrong credentials"
**Solution**: Make sure you created the user with `npm run create-admin-d1` first

## 🎉 You're All Set!

Once you complete the setup steps above:
1. All new users will be stored in Cloudflare D1
2. Login will authenticate against Cloudflare D1
3. Bills and drafts will be saved to Cloudflare D1
4. No more local database files

**Next Steps:**
1. Run `npm run init-d1` to create tables
2. Run `npm run create-admin-d1` to create your admin user
3. Start the server with `npm start`
4. Login from the frontend

---

**Need to switch back to local SQLite?**
Just change the imports in `index.js` and controllers from:
```javascript
import { ... } from './config/cloudflare-d1.js';
```
back to:
```javascript
import { ... } from './config/database.js';
```
