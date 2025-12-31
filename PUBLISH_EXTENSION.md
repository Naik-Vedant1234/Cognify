# Publishing Cognify Extension to Chrome Web Store

## Quick Start (5 Steps)

### 1. Create Missing Icons
Choose one method:

**Method A: Python Script (Recommended)**
```bash
pip install pillow
python create-icons.py
```

**Method B: Online Tool**
1. Go to https://www.favicon-generator.org/
2. Upload `extension/icons/icon16.png`
3. Download 48x48 and 128x128 versions
4. Save as `icon48.png` and `icon128.png` in `extension/icons/`

**Method C: Manual (Paint/Photoshop)**
1. Open `extension/icons/icon16.png`
2. Resize to 48x48, save as `icon48.png`
3. Resize to 128x128, save as `icon128.png`

---

### 2. Take Screenshots
Take 3-5 screenshots (1280x800 recommended):
1. Extension popup showing today's stats
2. Dashboard with time tracking data
3. Focus mode setup screen
4. Blocked site page
5. Dashboard focus mode statistics

**How to take screenshots:**
- Windows: Win + Shift + S
- Chrome: F12 → Device toolbar → Set to 1280x800 → Screenshot

---

### 3. Package Extension
```bash
# Run the packaging script
package-extension.bat
```

This creates `cognify-extension.zip` with all required files.

---

### 4. Register & Upload

1. **Register** (one-time):
   - Go to https://chrome.google.com/webstore/devconsole
   - Pay $5 registration fee
   - Accept developer agreement

2. **Upload**:
   - Click "New Item"
   - Upload `cognify-extension.zip`
   - Wait for processing

---

### 5. Fill Store Listing

Copy the information from `CHROME_WEB_STORE_SUBMISSION.md`:
- Product name
- Description (detailed + summary)
- Screenshots
- Category: Productivity
- Privacy justifications
- Submit for review

---

## Detailed Guides

- **Complete Guide**: `CHROME_WEB_STORE_SUBMISSION.md`
- **Checklist**: `CHROME_STORE_CHECKLIST.md`
- **Icon Help**: `extension/icons/README.md`

---

## Files You'll Need

### Required Files (in ZIP)
✅ All files are ready in `extension/` folder:
- manifest.json
- background.js
- popup.html, popup.js
- content.js, content.css
- blocked.html
- config.js
- inject-userid.js
- icons/ (need to create 48 & 128)

### Store Assets (upload separately)
- 3-5 screenshots (1280x800)
- Optional: promotional images

---

## Store Listing Copy-Paste

### Name
```
Cognify - Time Tracker & Focus Mode
```

### Short Description (132 chars)
```
Track browsing time automatically, block distracting sites with Focus Mode, and boost productivity with detailed analytics.
```

### Detailed Description
See `CHROME_WEB_STORE_SUBMISSION.md` for full description.

### Category
```
Productivity
```

---

## Permission Justifications

**tabs**
```
Required to detect which website the user is currently viewing to track time spent on each site.
```

**storage**
```
Required to store user preferences, tracking data, and focus mode settings locally.
```

**alarms**
```
Required to keep the service worker alive and periodically save tracking data.
```

**webNavigation**
```
Required to detect when users navigate to blocked websites during focus mode sessions.
```

**host_permissions (<all_urls>)**
```
Required to track time on all websites and block access to sites during focus mode. The extension needs to monitor all URLs to provide accurate time tracking and focus mode blocking functionality.
```

---

## After Approval

### Update Backend CORS
Once approved, your extension will get a new ID. Update `backend/server.js`:

```javascript
const allowedOrigins = [
  "https://cognify-theta.vercel.app",
  "chrome-extension://dofaahdpjponmcjfcjkkjemipgabfapi", // old dev ID
  "chrome-extension://YOUR_NEW_EXTENSION_ID_HERE" // add this
];
```

Redeploy backend to Render.

---

## Timeline

- **Icon creation**: 10-30 minutes
- **Screenshots**: 15-30 minutes
- **Form filling**: 30-60 minutes
- **Review wait**: 1-3 business days
- **Total**: ~2-4 days

---

## Cost

- **Registration**: $5 (one-time, forever)
- **Hosting**: $0 (already deployed)
- **Updates**: $0 (unlimited)

---

## Support

- **Chrome Web Store Help**: https://developer.chrome.com/docs/webstore/
- **Developer Dashboard**: https://chrome.google.com/webstore/devconsole
- **Program Policies**: https://developer.chrome.com/docs/webstore/program-policies/

---

## Troubleshooting

### "Icons not found"
→ Run `create-icons.py` or create manually

### "Package invalid"
→ Check manifest.json syntax, ensure all files exist

### "Permission not justified"
→ Use exact justifications from this guide

### "Rejected for minimum functionality"
→ Shouldn't happen - extension provides substantial value

---

## Quick Commands

```bash
# Create icons (if you have Python + Pillow)
python create-icons.py

# Package extension
package-extension.bat

# Test locally before submitting
# 1. Go to chrome://extensions
# 2. Enable Developer Mode
# 3. Load unpacked → select extension folder
# 4. Test all features
```

---

## Ready to Submit?

✅ Use `CHROME_STORE_CHECKLIST.md` to verify everything is ready!

---

Good luck! Your extension is ready for the world! 🚀
