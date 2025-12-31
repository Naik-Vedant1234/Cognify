@echo off
echo ========================================
echo Cognify Extension Packager
echo ========================================
echo.

cd extension

echo Checking required files...
if not exist "manifest.json" (
    echo ERROR: manifest.json not found!
    pause
    exit /b 1
)

if not exist "icons\icon16.png" (
    echo ERROR: icons\icon16.png not found!
    pause
    exit /b 1
)

echo.
echo Creating extension package...
echo.

powershell -Command "Compress-Archive -Path background.js,blocked.html,config.js,content.css,content.js,inject-userid.js,manifest.json,popup.html,popup.js,icons -DestinationPath ..\cognify-extension.zip -Force"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Extension packaged!
    echo ========================================
    echo.
    echo File created: cognify-extension.zip
    echo Location: %CD%\..\cognify-extension.zip
    echo.
    echo Next steps:
    echo 1. Create icons: icon48.png and icon128.png
    echo 2. Go to: https://chrome.google.com/webstore/devconsole
    echo 3. Upload cognify-extension.zip
    echo 4. Follow CHROME_WEB_STORE_SUBMISSION.md guide
    echo.
) else (
    echo.
    echo ERROR: Failed to create package!
    echo.
)

cd ..
pause
