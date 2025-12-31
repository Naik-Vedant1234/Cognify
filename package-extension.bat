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

if not exist "icons\icon48.png" (
    echo ERROR: icons\icon48.png not found!
    pause
    exit /b 1
)

if not exist "icons\icon144.png" (
    echo ERROR: icons\icon144.png not found!
    pause
    exit /b 1
)

echo.
echo Creating extension package...
echo.

powershell -Command "Compress-Archive -Path background.js,blocked.html,config.js,content.css,content.js,inject-userid.js,manifest.json,popup.html,popup.js,icons,INSTALLATION_GUIDE.txt -DestinationPath ..\cognify-extension.zip -Force"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Extension packaged!
    echo ========================================
    echo.
    echo File created: cognify-extension.zip
    echo Location: %CD%\..\cognify-extension.zip
    echo.
    echo Also copying to frontend/public for website download...
    powershell -Command "Copy-Item ..\cognify-extension.zip ..\frontend\public\cognify-extension.zip -Force"
    echo.
    echo Next steps:
    echo 1. Test the extension locally
    echo 2. Deploy frontend to update website download
    echo 3. Share the download link with users
    echo.
) else (
    echo.
    echo ERROR: Failed to create package!
    echo.
)

cd ..
pause
