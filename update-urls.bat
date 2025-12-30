@echo off
echo ========================================
echo Cognify URL Update Helper
echo ========================================
echo.
echo This script helps you update URLs after deployment
echo.

set /p BACKEND_URL="Enter your backend URL (e.g., https://cognify-api.onrender.com): "
set /p FRONTEND_URL="Enter your frontend URL (e.g., https://cognify.vercel.app): "

echo.
echo ========================================
echo URLs to Update:
echo ========================================
echo.
echo 1. extension/config.js
echo    Change API_URL to: %BACKEND_URL%/api
echo.
echo 2. extension/blocked.html (line 193)
echo    Change href to: %FRONTEND_URL%
echo.
echo 3. extension/inject-userid.js (line 4)
echo    Change hostname check to match: %FRONTEND_URL%
echo.
echo 4. extension/manifest.json (line 26)
echo    Change matches to: ["%FRONTEND_URL%/*"]
echo.
echo 5. Render Environment Variables:
echo    CORS_ORIGIN = %FRONTEND_URL%
echo.
echo 6. Vercel Environment Variables:
echo    VITE_API_URL = %BACKEND_URL%/api
echo.
echo ========================================
echo Update these files manually, then reload your extension!
echo ========================================
pause
