# Chrome Web Store Submission Guide

## Prerequisites

1. **Google Account** with Chrome Web Store Developer access
2. **One-time registration fee**: $5 USD
3. **All required assets** (icons, screenshots, promotional images)

---

## Step 1: Create Required Icons

You need icons in these sizes:
- **16x16** - Already exists ✓
- **48x48** - Need to create
- **128x128** - Need to create

### How to Create Icons

**Option 1: Use an online tool**
- Go to https://www.favicon-generator.org/
- Upload your 16x16 icon
- Generate larger sizes
- Download and save to `extension/icons/`

**Option 2: Use design software**
- Use Figma, Canva, or Photoshop
- Create a simple clock/timer icon with purple gradient
- Export as PNG in 48x48 and 128x128

**Quick Fix**: Resize the existing icon16.png:
```bash
# If you have ImageMagick installed
magick extension/icons/icon16.png -resize 48x48 extension/icons/icon48.png
magick extension/icons/icon16.png -resize 128x128 extension/icons/icon128.png
```

---

## Step 2: Create Store Assets

### Required Screenshots (1280x800 or 640x400)
Take 3-5 screenshots showing:
1. Extension popup with stats
2. Dashboard with time tracking
3. Focus mode setup
4. Blocked site page
5. Dashboard with focus stats

### Optional Promotional Images
- **Small tile**: 440x280 (recommended)
- **Large tile**: 920x680 (optional)
- **Marquee**: 1400x560 (optional)

---

## Step 3: Prepare Extension Package

### Create a ZIP file with these files:
```
cognify-extension.zip
├── background.js
├── blocked.html
├── config.js
├── content.css
├── content.js
├── inject-userid.js
├── manifest.json
├── popup.html
├── popup.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Create the ZIP:
```bash
cd extension
# Windows PowerShell
Compress-Archive -Path * -DestinationPath ../cognify-extension.zip -Force
```

---

## Step 4: Chrome Web Store Developer Dashboard

### 4.1 Register as Developer
1. Go to https://chrome.google.com/webstore/devconsole
2. Sign in with your Google account
3. Pay the $5 one-time registration fee
4. Accept the developer agreement

### 4.2 Create New Item
1. Click **"New Item"**
2. Upload `cognify-extension.zip`
3. Wait for upload to complete

---

## Step 5: Fill Out Store Listing

### Product Details

**Category**: Productivity

**Language**: English (United States)

### Store Listing Tab

**Detailed Description** (copy this):
```
Cognify is a powerful time tracking and productivity extension that helps you understand how you spend your time online and stay focused on what matters.

🕐 AUTOMATIC TIME TRACKING
• Tracks time spent on every website automatically
• Only counts active time (pauses when you switch tabs)
• View detailed statistics on your personal dashboard
• See daily, weekly, and monthly breakdowns

🎯 FOCUS MODE
• Block distracting websites for a set duration
• Create custom focus sessions with specific blocked sites
• Track your focus sessions and productivity streaks
• Get insights on your most blocked distractions

📊 BEAUTIFUL DASHBOARD
• View comprehensive analytics at cognify-theta.vercel.app
• See your most visited sites and time spent
• Track focus mode statistics and achievements
• Monitor your productivity trends over time

🔒 PRIVACY FIRST
• All your data is private and secure
• No data selling or third-party sharing
• Sync across browsers with your account
• Works completely offline for tracking

✨ KEY FEATURES
• Real-time tracking with visual timer
• Smart domain detection and categorization
• Cross-browser sync support (Chrome, Brave, Edge)
• Clean, modern interface
• Lightweight and fast

Perfect for students, professionals, and anyone looking to boost productivity and understand their browsing habits better.
```

**Summary** (132 characters max):
```
Track browsing time automatically, block distracting sites with Focus Mode, and boost productivity with detailed analytics.
```

**Screenshots**: Upload 3-5 screenshots (1280x800 recommended)

**Promotional Images**: Upload tiles if you created them

**Icon**: Will use the 128x128 from manifest

**Category**: Productivity

**Language**: English

---

## Step 6: Privacy Practices

### Single Purpose Description:
```
Cognify tracks the time users spend on websites and provides focus mode to block distracting sites, helping users improve productivity.
```

### Permission Justifications:

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

### Data Usage:
- **Does NOT collect user data**
- **Does NOT sell user data**
- **Does NOT use data for purposes unrelated to the extension's functionality**

### Remote Code:
- Select **"No"** - extension does not use remote code

---

## Step 7: Distribution

### Visibility:
- **Public** (anyone can find and install)
- **Unlisted** (only people with link can install)

Choose **Public** to make it available to everyone.

### Regions:
Select **All regions** or specific countries

---

## Step 8: Submit for Review

1. Review all information
2. Click **"Submit for Review"**
3. Wait for Google's review (typically 1-3 business days)
4. Check email for approval or feedback

---

## Step 9: After Approval

### Your extension will be live at:
```
https://chrome.google.com/webstore/detail/[your-extension-id]
```

### Share your extension:
- Add install button to your website
- Share on social media
- Add to your GitHub README

### Monitor:
- Check reviews and ratings
- Respond to user feedback
- Monitor crash reports in Developer Dashboard

---

## Troubleshooting Common Rejections

### "Permissions not justified"
- Make sure each permission has a clear, specific justification
- Explain exactly why the extension needs that permission

### "Single purpose violation"
- Ensure description focuses on one main purpose (time tracking + focus)
- Don't mention unrelated features

### "Deceptive behavior"
- Make sure all functionality is clearly described
- Don't hide features or data collection

### "Minimum functionality"
- Extension must provide substantial value
- Cognify does - it tracks time and blocks sites ✓

---

## Update Process (Future Updates)

1. Update version in `manifest.json` (e.g., 1.0.0 → 1.0.1)
2. Create new ZIP file
3. Go to Developer Dashboard
4. Click on your extension
5. Click **"Package"** tab
6. Upload new ZIP
7. Submit for review

---

## Important Notes

⚠️ **Before submitting:**
- Test the extension thoroughly
- Make sure all icons exist (16, 48, 128)
- Verify all URLs point to production (not localhost)
- Test focus mode blocking
- Test time tracking
- Test dashboard sync

✅ **After approval:**
- Extension ID will change from your dev ID
- Update CORS in backend to allow new extension ID
- Update manifest content_scripts if needed

---

## Cost Summary

- **Registration**: $5 (one-time)
- **Hosting**: Free (already on Render + Vercel)
- **Maintenance**: Free
- **Updates**: Free (unlimited)

---

## Support & Resources

- Chrome Web Store Developer Documentation: https://developer.chrome.com/docs/webstore/
- Chrome Web Store Developer Dashboard: https://chrome.google.com/webstore/devconsole
- Extension Review Guidelines: https://developer.chrome.com/docs/webstore/program-policies/

---

Good luck with your submission! 🚀
