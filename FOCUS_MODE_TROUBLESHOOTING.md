# Focus Mode Blocking Troubleshooting Guide

If sites aren't being blocked during focus mode, follow these steps to diagnose the issue.

---

## Step 1: Check Extension Console

1. Go to `chrome://extensions`
2. Find **Cognify** extension
3. Click **"service worker"** (blue link)
4. This opens the extension console

### What to Look For:

**When you start a focus session and try to visit a blocked site, you should see:**

```
Checking if youtube.com should be blocked for user user_abc123
Block check result for youtube.com: { blocked: true, session: {...} }
🚫 BLOCKING youtube.com
🔒 Redirecting tab 123 to blocked page for youtube.com
✅ Successfully blocked youtube.com
```

**If you see errors:**

❌ `No userId available for blocking check`
→ **Fix:** Reload the extension

❌ `API returned status 500` or `Focus check API error`
→ **Fix:** Backend issue, check Render logs

❌ `Block check result: { blocked: false }`
→ **Fix:** Session might have expired or domain doesn't match

---

## Step 2: Verify Active Session

1. Go to `https://cognify-theta.vercel.app/focus`
2. Check if you see "Focus Session Active"
3. Verify the sites you want to block are listed

**Common Issues:**

- Session expired (time ran out)
- You ended the session accidentally
- Sites weren't added to the block list

---

## Step 3: Check Domain Matching

The extension checks domains, not full URLs.

**Examples:**

✅ **Will Block:**
- Blocked: `youtube.com`
- Visiting: `https://www.youtube.com/watch?v=...`
- Visiting: `https://youtube.com/trending`

❌ **Won't Block:**
- Blocked: `youtube.com`
- Visiting: `https://youtu.be/...` (different domain!)

**Solution:** Add both domains:
- `youtube.com`
- `youtu.be`

---

## Step 4: Test the API Directly

Open a new tab and test the API:

```
https://cognify-gxaa.onrender.com/api/focus/check/YOUR_USER_ID/youtube.com
```

**To get your user ID:**
1. Open extension console (`chrome://extensions` → service worker)
2. Look for: `User ID loaded: user_abc123`
3. Copy the user ID

**Expected Response:**

If session is active and youtube.com is blocked:
```json
{
  "blocked": true,
  "session": {
    "blockedDomains": ["youtube.com", "facebook.com"],
    ...
  }
}
```

If not blocked:
```json
{
  "blocked": false
}
```

---

## Step 5: Check Backend Logs

1. Go to https://dashboard.render.com
2. Click on your `cognify-api` service
3. Click "Logs" tab
4. Look for errors when checking blocked sites

**What to look for:**

```
Checking if blocked: { userId: 'user_abc123', domain: 'youtube.com' }
Domain check result: { domain: 'youtube.com', ... isBlocked: true }
```

---

## Step 6: Reload Extension

Sometimes the extension needs a fresh start:

1. Go to `chrome://extensions`
2. Find Cognify
3. Click the **reload icon** (circular arrow)
4. Try blocking again

---

## Step 7: Check CORS Settings

If the API calls are failing due to CORS:

1. Go to Render dashboard
2. Check `CORS_ORIGIN` environment variable
3. Should include: `chrome-extension://YOUR_EXTENSION_ID`

**To get extension ID:**
1. Go to `chrome://extensions`
2. Look under Cognify extension name
3. Copy the ID (e.g., `dofaahdpjponmcjfcjkkjemipgabfapi`)

---

## Common Issues & Solutions

### Issue 1: "Sites aren't being blocked at all"

**Checklist:**
- [ ] Extension is loaded and enabled
- [ ] Focus session is active (check dashboard)
- [ ] Sites are in the blocked list
- [ ] Extension has correct API URL
- [ ] Backend is running (check health endpoint)

**Quick Fix:**
1. Reload extension
2. Start a new focus session
3. Try blocking a site

---

### Issue 2: "Some sites block, others don't"

**Likely Cause:** Domain mismatch

**Examples:**
- `reddit.com` blocks `www.reddit.com` ✅
- `reddit.com` doesn't block `old.reddit.com` ❌

**Solution:** Add all variations:
- `reddit.com`
- `old.reddit.com`
- `new.reddit.com`

---

### Issue 3: "Blocking works but then stops"

**Likely Cause:** Session expired

**Check:**
1. Look at timer on dashboard
2. If it shows 0:00, session ended
3. Start a new session

---

### Issue 4: "Getting redirected but page loads anyway"

**Likely Cause:** Race condition or cached page

**Solution:**
1. Clear browser cache
2. Reload extension
3. Try in incognito mode

---

### Issue 5: "Extension console shows errors"

**Common Errors:**

**Error:** `Failed to fetch`
- Backend is down or unreachable
- Check: https://cognify-gxaa.onrender.com/api/health

**Error:** `CORS policy`
- Extension ID not in CORS_ORIGIN
- Add extension ID to backend environment variables

**Error:** `userId is undefined`
- Extension storage issue
- Reload extension to regenerate user ID

---

## Testing Checklist

Use this to verify blocking works:

1. **Start Session:**
   - [ ] Go to dashboard
   - [ ] Add `youtube.com` to block list
   - [ ] Start 5-minute session
   - [ ] See "Focus Session Active"

2. **Test Blocking:**
   - [ ] Open new tab
   - [ ] Type `youtube.com` in address bar
   - [ ] Press Enter
   - [ ] Should see blocked page

3. **Check Console:**
   - [ ] Open extension console
   - [ ] Should see "BLOCKING youtube.com"
   - [ ] Should see "Successfully blocked"

4. **Verify Dashboard:**
   - [ ] Go back to dashboard
   - [ ] Should still show active session
   - [ ] Timer should be counting down

---

## Debug Mode

To enable detailed logging:

1. Open extension console
2. Run: `localStorage.setItem('debug', 'true')`
3. Reload extension
4. Try blocking again
5. Check for detailed logs

---

## Still Not Working?

If you've tried everything:

1. **Export your data** (if any)
2. **Uninstall extension**
3. **Reload extension** from folder
4. **Start fresh session**
5. **Test with simple site** (e.g., `example.com`)

---

## Contact Support

If blocking still doesn't work:

1. Open extension console
2. Copy all logs
3. Check backend logs on Render
4. Share error messages

**Include:**
- Extension ID
- User ID
- Site you're trying to block
- Console logs
- Backend logs (if accessible)

---

## Quick Test Script

Run this in extension console to test:

```javascript
// Test blocking check
const testDomain = 'youtube.com';
fetch(`https://cognify-gxaa.onrender.com/api/focus/check/YOUR_USER_ID/${testDomain}`)
  .then(r => r.json())
  .then(data => console.log('Block check:', data))
  .catch(err => console.error('Error:', err));
```

Replace `YOUR_USER_ID` with your actual user ID.

---

## Success Indicators

✅ Extension console shows blocking messages
✅ Blocked page appears when visiting site
✅ Dashboard shows active session
✅ Timer counts down
✅ Can't access blocked sites

If all these work, focus mode is functioning correctly! 🎯
