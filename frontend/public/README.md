# Public Assets

This folder contains static files that are served directly by the web server.

## Files

- **cognify-extension.zip** - The Cognify Chrome extension package for manual installation

## Usage

The extension ZIP file is available at:
```
https://cognify-theta.vercel.app/cognify-extension.zip
```

Users can download this file from the extension download page at:
```
https://cognify-theta.vercel.app/extension
```

## Updating the Extension

To update the extension package:

1. Make changes to files in the `extension/` folder
2. Run the packaging script:
   ```bash
   package-extension.bat
   ```
   Or manually create the ZIP:
   ```bash
   Compress-Archive -Path extension/* -DestinationPath frontend/public/cognify-extension.zip -Force
   ```
3. Commit and push changes
4. Vercel will automatically deploy the new version

## Note

This approach allows users to install the extension without needing to publish it to the Chrome Web Store (which requires a $5 registration fee).
