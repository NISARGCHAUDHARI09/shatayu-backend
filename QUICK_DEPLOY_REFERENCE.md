# 🚀 QUICK DEPLOYMENT CHECKLIST

## Copy-Paste Commands (Step-by-Step)

Run these commands in PowerShell from `e:\shatayu software`:

### 1️⃣ Configure Git (First Time)
```powershell
git config user.email "your-email@example.com"
git config user.name "Your Name"
```

### 2️⃣ Add Render Remote
**⚠️ FIRST: Get your Render git URL from https://dashboard.render.com**

Then run:
```powershell
git remote add origin YOUR_RENDER_GIT_URL_HERE
```

Example:
```powershell
git remote add origin https://github.com/username/shatayu-hospital.git
```

### 3️⃣ Commit & Push Changes
```powershell
git add -A
git commit -m "Fix: Allow doctors to access staff management - Add requireDoctorOrAdmin middleware"
git push -u origin main
```

---

## ✅ After Pushing

1. Go to **https://dashboard.render.com**
2. Click **"shatayu-backend"** service
3. Wait for deployment status → 🟢 **Live**
4. Takes 2-5 minutes usually

---

## 🧪 Test It

- Log in as **doctor** user
- Go to **Doctor → Staff Management**
- Should see staff list (no 403 error) ✅

---

## ❓ Find Your Render Git URL

1. **https://dashboard.render.com**
2. **"shatayu-backend"** service
3. **Settings** → **Git Repository**
4. Copy the URL (ends with `.git`)

---

## 🆘 If It Fails

**Remote already exists?**
```powershell
git remote remove origin
git remote add origin YOUR_RENDER_GIT_URL_HERE
```

**Not sure about branch name?**
```powershell
git branch -a
# Use whatever shows (usually 'main' or 'master')
```

**Verify before pushing:**
```powershell
git status
# Should show modified files ready to commit
```
