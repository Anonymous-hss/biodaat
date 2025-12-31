@echo off
echo ========================================
echo   Biodaat Deploy Script
echo ========================================
echo.

cd /d %~dp0

echo [1/4] Building frontend...
cd app
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Adding files to git...
cd ..
git add app/out

echo.
echo [3/4] Committing...
git commit -m "Rebuild frontend for production"

echo.
echo [4/4] Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   Deploy complete!
echo   Now go to Hostinger and click Pull
echo ========================================
pause
