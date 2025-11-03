# Fix: Sync User ID Between Extension and Dashboard

## The Problem
Extension and Dashboard are using different user IDs, so data doesn't show up.

## Quick Fix (Do This Now!)

### Step 1: Get Extension User ID
1. Go to `chrome://extensions/`
2. Find "Cognify - Time Tracker"
3. Click "Inspect views: service worker"
4. In the console, type:
```javascript
chrome.storage.local.get(['userId'], console.log)
```
5. Copy the user ID (looks like: `user_abc123xyz`)

### Step 2: Set Dashboard to Use Same ID
1. Open http://localhost:5173
2. Press F12 to open console
3. Type (replace with YOUR user ID from step 1):
```javascript
localStorage.setItem('cognify_user_id', 'user_abc123xyz')
```
4. Refresh the page (F5)

### Step 3: Verify
1. In dashboard console (F12), type:
```javascript
localStorage.getItem('cognify_user_id')
```
2. Should match the extension user ID
3. Refresh dashboard - data should appear!

## Permanent Fix

I'll update the code so they always sync automatically.
