# Service Worker Staying Active - Fix Guide

## The Problem

Chrome Manifest V3 service workers automatically go inactive after 30 seconds of inactivity. This causes:
- Focus mode blocking to stop working
- Time tracking to pause
- Extension to appear "dead"

## The Solution

We've implemented multiple strategies to keep the service worker active:

### 1. Aggressive Keepalive Alarm ⏰
- Pings every **15 seconds** (instead of 30)
- Checks active tab on each ping
- Logs activity to console

### 2. Multiple Wake-Up Triggers 🔔
Service worker wakes up on:
- Tab activation (switching tabs)
- Tab updates (page loads, URL changes)
- Window focus changes (Alt+Tab)
- Navigation events

### 3. Automatic Alarm Setup ⚙️
- Ensures alarm is always set
- Re-creates alarm if missing
- Runs on startup and install

---

## How to Verify It's Working

### Step 1: Reload Extension
1. Go to `chrome://extensions`
2. Find **Cognify**
3. Click **reload icon**

### Step 2: Open Service Worker Console
1. Click **"service worker"** link
2. Console should open and show:
```
🚀 Extension started
👤 Loaded existing user ID: user_abc123
⚙️ Setting up keepalive alarm
```

### Step 3: Watch for Keepalive Pings
Every 15 seconds you should see:
```
⏰ Service worker keepalive ping
🔍 Keepalive checking active tab: https://...
```

### Step 4: Test Wake-Up Triggers
Switch tabs and you should see:
```
🔔 Service worker woken by tab activation
Tab activated: 123
```

---

## If Service Worker Still Goes Inactive

### Quick Fix:
1. Click on **"service worker (inactive)"**
2. It will activate and open console
3. Service worker is now active again

### Why This Happens:
- Chrome aggressively terminates service workers to save resources
- Even with keepalive, it may still go inactive
- This is a Chrome limitation, not a bug in our code

### Workaround:
The service worker will automatically wake up when:
- You switch tabs
- You load a new page
- You interact with the extension

**The blocking will still work** because:
- Tab events wake up the service worker
- Navigation events trigger checks
- The service worker activates before blocking

---

## Testing Focus Mode Blocking

Even if service worker shows "inactive":

1. **Start a focus session** on dashboard
2. **Try to visit a blocked site**
3. **Service worker will wake up** automatically
4. **Site will be blocked**

The "inactive" status doesn't mean it's broken - it just means it's sleeping until needed.

---

## Console Logs to Expect

### On Extension Load:
```
🚀 Extension started
👤 Loaded existing user ID: user_abc123
⚙️ Setting up keepalive alarm
```

### Every 15 Seconds:
```
⏰ Service worker keepalive ping
🔍 Keepalive checking active tab: https://youtube.com
```

### On Tab Switch:
```
🔔 Service worker woken by tab activation
Tab activated: 456
Checking if youtube.com should be blocked for user user_abc123
```

### On Blocking:
```
Block check result for youtube.com: { blocked: true, ... }
🚫 BLOCKING youtube.com
🔒 Redirecting tab 456 to blocked page for youtube.com
✅ Successfully blocked youtube.com
```

---

## Advanced: Force Service Worker to Stay Active

If you need the service worker to stay active for debugging:

1. Open service worker console
2. Click the **"Keep service worker active"** checkbox (if available)
3. Or run this in console:
```javascript
setInterval(() => {
  console.log('Manual keepalive');
}, 5000);
```

---

## What We've Implemented

### ✅ Keepalive Alarm
- Frequency: Every 15 seconds
- Action: Checks active tab
- Logs: Shows activity

### ✅ Event Listeners
- Tab activation
- Tab updates
- Window focus
- Navigation events

### ✅ Automatic Setup
- Runs on startup
- Runs on install
- Verifies alarm exists

### ✅ Detailed Logging
- Emoji indicators
- Clear messages
- Easy debugging

---

## Known Limitations

1. **Chrome will still terminate service workers** after extended inactivity (5+ minutes)
2. **This is by design** in Manifest V3 for resource management
3. **Service worker will wake up** when needed for blocking
4. **No data is lost** - state is preserved in chrome.storage

---

## Best Practices

### For Users:
- Don't worry if it shows "inactive"
- It will wake up when needed
- Blocking still works

### For Developers:
- Keep service worker console open during testing
- Watch for keepalive pings
- Verify wake-up triggers work

---

## Troubleshooting

### Issue: No keepalive pings
**Solution:** Reload extension

### Issue: Service worker won't activate
**Solution:** Click "service worker (inactive)" to manually activate

### Issue: Blocking doesn't work
**Solution:** Check if focus session is still active on dashboard

### Issue: Console shows errors
**Solution:** Check API connectivity and CORS settings

---

## Summary

✅ Service worker has aggressive keepalive (15s)
✅ Multiple wake-up triggers implemented
✅ Automatic alarm setup on startup
✅ Detailed logging for debugging
✅ Blocking works even when "inactive"

The service worker may show as "inactive" but will automatically wake up when needed for blocking! 🎯
