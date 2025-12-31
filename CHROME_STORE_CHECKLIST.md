# Chrome Web Store Submission Checklist

## Before You Start
- [ ] Google account ready
- [ ] $5 USD for one-time developer registration fee
- [ ] Read CHROME_WEB_STORE_SUBMISSION.md guide

---

## 1. Create Required Icons
- [ ] icon48.png (48x48 pixels)
- [ ] icon128.png (128x128 pixels)
- [ ] Save both in `extension/icons/` folder

**Quick method**: Use https://www.favicon-generator.org/ to upscale icon16.png

---

## 2. Create Store Assets

### Screenshots (Required - at least 1, max 5)
- [ ] Screenshot 1: Extension popup showing stats
- [ ] Screenshot 2: Dashboard with time tracking
- [ ] Screenshot 3: Focus mode setup
- [ ] Screenshot 4: Blocked site page
- [ ] Screenshot 5: Focus mode statistics

**Size**: 1280x800 or 640x400 pixels

### Promotional Images (Optional)
- [ ] Small tile: 440x280
- [ ] Large tile: 920x680
- [ ] Marquee: 1400x560

---

## 3. Package Extension
- [ ] Run `package-extension.bat`
- [ ] Verify `cognify-extension.zip` was created
- [ ] Check ZIP contains all files (manifest, icons, scripts)

---

## 4. Test Extension One More Time
- [ ] Install from ZIP in Chrome (Load unpacked)
- [ ] Test time tracking on multiple sites
- [ ] Test focus mode blocking
- [ ] Test dashboard sync
- [ ] Check popup displays correctly
- [ ] Verify no console errors

---

## 5. Register as Chrome Web Store Developer
- [ ] Go to https://chrome.google.com/webstore/devconsole
- [ ] Sign in with Google account
- [ ] Pay $5 registration fee
- [ ] Accept developer agreement

---

## 6. Upload Extension
- [ ] Click "New Item" in Developer Dashboard
- [ ] Upload `cognify-extension.zip`
- [ ] Wait for upload to complete (no errors)

---

## 7. Fill Store Listing

### Product Details
- [ ] Category: Productivity
- [ ] Language: English (United States)

### Store Listing
- [ ] Copy detailed description from guide
- [ ] Copy summary (132 chars max)
- [ ] Upload 3-5 screenshots
- [ ] Upload promotional images (if created)
- [ ] Verify icon shows correctly

---

## 8. Privacy Practices

### Justifications
- [ ] Single purpose description
- [ ] tabs permission justification
- [ ] storage permission justification
- [ ] alarms permission justification
- [ ] webNavigation permission justification
- [ ] host_permissions justification

### Data Usage
- [ ] Confirm: Does NOT collect user data
- [ ] Confirm: Does NOT sell user data
- [ ] Confirm: Does NOT use remote code

---

## 9. Distribution Settings
- [ ] Choose visibility: Public or Unlisted
- [ ] Select regions: All regions
- [ ] Set pricing: Free

---

## 10. Submit for Review
- [ ] Review all information one last time
- [ ] Click "Submit for Review"
- [ ] Note submission date: ___________
- [ ] Check email for confirmation

---

## 11. After Submission

### Wait for Review (1-3 business days)
- [ ] Check email daily for updates
- [ ] Respond to any feedback from Google
- [ ] Make changes if requested

### After Approval
- [ ] Note your extension URL: ___________
- [ ] Update backend CORS with new extension ID
- [ ] Test installed version from store
- [ ] Share extension link
- [ ] Add to GitHub README
- [ ] Announce on social media

---

## Important URLs

- **Developer Dashboard**: https://chrome.google.com/webstore/devconsole
- **Your Extension** (after approval): https://chrome.google.com/webstore/detail/[extension-id]
- **Dashboard**: https://cognify-theta.vercel.app
- **Backend**: https://cognify-gxaa.onrender.com

---

## Common Issues & Solutions

### "Icons not found"
→ Make sure icon48.png and icon128.png exist in extension/icons/

### "Permissions not justified"
→ Use exact justifications from CHROME_WEB_STORE_SUBMISSION.md

### "Package upload failed"
→ Check ZIP file structure, ensure no extra folders

### "Minimum functionality requirement"
→ Extension provides substantial value (time tracking + focus mode) ✓

---

## Need Help?

- Read: CHROME_WEB_STORE_SUBMISSION.md (detailed guide)
- Check: extension/icons/README.md (icon creation help)
- Visit: https://developer.chrome.com/docs/webstore/

---

**Estimated Time**: 2-3 hours (setup + submission) + 1-3 days (review)

Good luck! 🚀
