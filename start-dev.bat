@echo off
echo Starting Cognify Development Environment...
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Dashboard...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Cognify is starting!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Don't forget to:
echo 1. Make sure MongoDB is running
echo 2. Load the Chrome extension from the 'extension' folder
echo.
echo Press any key to exit this window...
pause > nul
