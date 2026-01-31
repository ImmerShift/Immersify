@echo off
title Immersify Launcher
echo ==========================================
echo       Immersify App Launcher
echo ==========================================

:: 1. Check for Node.js
echo Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found.
    echo Please install it from https://nodejs.org/ and TRY AGAIN.
    echo.
    pause
    exit /b
)

:: 2. Navigate to Project Directory
cd /d "%~dp0"

:: 3. Install Dependencies
echo [INFO] Installing dependencies...
echo This may take a few minutes. Please wait.
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b
)

:: 4. Start Frontend Client
echo.
echo [1/2] Starting Frontend Client...
start "Immersify Frontend" cmd /k "npm run dev"

:: 5. Open Browser
echo.
echo [2/2] Launching Browser in 5 seconds...
timeout /t 5 >nul
start http://localhost:5173/Immersify/

echo.
echo ==========================================
echo       Immersify is running!
echo    Don't close the popup windows.
echo ==========================================
echo.
pause
