# Deploy to Hostinger via Git - Complete Guide

## Prerequisites

1. **Hostinger Account** with Git support enabled
2. **SSH Access** to your Hostinger hosting account
3. **Git installed** on your local machine (you already have this)

---

## Step 1: Enable Git on Hostinger

1. Login to **Hostinger Control Panel** (hPanel)
2. Go to **Advanced** → **Git**
3. Click **"Create Repository"**
4. Configure:
   - **Repository Name**: `biodaat` (or your project name)
   - **Branch**: `main`
   - **Repository Path**: `/home/u123456789/domains/yourdomain.com/public_html`
     *(Replace with your actual path)*

5. Hostinger will provide you with:
   - **Git Remote URL** (something like: `ssh://u123456789@yourdomain.com/~/biodaat.git`)
   - **Deployment Path**

---

## Step 2: Add Hostinger as Git Remote

Open terminal/PowerShell and run:

```bash
cd a:\My_Projects\v2.bio-data-maker

# Add Hostinger as a remote (replace with your actual Git URL)
git remote add hostinger ssh://u123456789@yourdomain.com/~/biodaat.git

# Verify remotes
git remote -v
```

You should see:
```
origin      https://github.com/Anonymous-hss/deploy.php.git (fetch)
origin      https://github.com/Anonymous-hss/deploy.php.git (push)
hostinger   ssh://u123456789@yourdomain.com/~/biodaat.git (fetch)
hostinger   ssh://u123456789@yourdomain.com/~/biodaat.git (push)
```

---

## Step 3: Set Up SSH Key (First Time Only)

### Generate SSH Key (if you don't have one)

```powershell
# Check if you have an SSH key
ls ~/.ssh/id_rsa.pub

# If not, generate one
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# Press Enter for all prompts (default location, no passphrase)

# Copy your public key
type ~\.ssh\id_rsa.pub | clip
```

### Add SSH Key to Hostinger

1. In **Hostinger hPanel**, go to **Advanced** → **SSH Access**
2. Click **"Add SSH Key"**
3. Paste your public key
4. Save

---

## Step 4: Configure Deployment Script

Create/Update `deploy-hostinger.bat`:

```batch
@echo off
echo ========================================
echo   Biodaat Deploy to Hostinger
echo ========================================
echo.

cd /d %~dp0

echo [1/5] Building frontend...
cd app
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo [2/5] Copying files to root for deployment...
cd ..
xcopy /E /I /Y app\out\* public_html\

echo.
echo [3/5] Adding files to git...
git add .

echo.
echo [4/5] Committing...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Deploy to production
git commit -m "%commit_msg%"

echo.
echo [5/5] Pushing to Hostinger...
git push hostinger main

echo.
echo ========================================
echo   Deploy complete!
echo   Check: https://yourdomain.com
echo ========================================
pause
```

---

## Step 5: Update .gitignore

Make sure your `.gitignore` includes:

```
# Next.js
app/.next/
app/node_modules/

# Keep these for deployment
!app/out/
!public_html/
```

---

## Step 6: Deploy for the First Time

```bash
# Build the app
cd app
npm run build

# Go back to root
cd ..

# Add Hostinger remote (if not done)
git remote add hostinger ssh://u123456789@yourdomain.com/~/biodaat.git

# Push to Hostinger
git push hostinger main --force  # Use --force only for first push
```

---

## Alternative: Simple rsync Deployment

If Git seems complicated, you can use **FTP/SFTP** or create a simpler script:

### Using FileZilla/SFTP:
1. Build: `npm run build` in `/app`
2. Upload `/app/out/*` to Hostinger's `public_html/`
3. Upload `/api/*` to `public_html/api/`

### Using deploy script:
```batch
@echo off
cd app
npm run build
cd ..
echo Files built in app/out/
echo Now upload to Hostinger via FTP
pause
```

---

## Troubleshooting

### "Permission denied (publickey)"
- Your SSH key isn't added to Hostinger
- Go to Hostinger → SSH Access → Add your key

### "Repository not found"
- Double-check the Git remote URL
- Ensure Git is enabled in Hostinger for your domain

### "Build fails"
- Fix any errors shown in the build output
- Check `app/package.json` for correct build script

---

## Quick Deploy Commands

After initial setup, every time you want to deploy:

```bash
# Option 1: Run deploy script
.\deploy-hostinger.bat

# Option 2: Manual commands
cd app
npm run build
cd ..
git add .
git commit -m "Deploy update"
git push hostinger main
```

---

## What Gets Deployed

```
Hostinger Server:
├── api/                    # PHP backend
│   ├── biodatas.php
│   ├── cms-*.php
│   └── ...
├── admin/                  # Admin panel
├── templates/              # PDF templates
├── storage/                # Generated files
└── index.html              # Next.js static export
    ├── _next/              # Static assets
    └── ...                 # Other pages
```

---

## Notes

- **GitHub** is for version control and collaboration
- **Hostinger** is your live production server
- Always test locally (`npm run dev`) before deploying
- Keep both remotes updated:
  - `git push origin main` → GitHub
  - `git push hostinger main` → Hostinger (live site)
