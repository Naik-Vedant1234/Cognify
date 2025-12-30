# Quick Deploy Guide (30 Minutes)

The fastest way to get Cognify deployed and running.

## What You'll Deploy

- **Backend** → Render (free)
- **Database** → MongoDB Atlas (free)
- **Frontend** → Vercel (free)
- **Extension** → Load locally in Chrome

---

## Step 1: MongoDB Atlas (5 min)

1. Go to https://mongodb.com/cloud/atlas → Sign up
2. Create free cluster → Choose AWS, any region
3. Create user: `cognify` / `<strong-password>`
4. Network Access → Add IP: `0.0.0.0/0`
5. Connect → Drivers → Copy connection string
6. Save it: `mongodb+srv://cognify:<password>@cluster.mongodb.net/cognify`

---

## Step 2: Deploy Backend to Render (10 min)

1. Push your code to GitHub (if not already)
2. Go to https://render.com → Sign up with GitHub
3. New + → Web Service → Connect your repo
4. Settings:
   - **Name**: `cognify-api`
   - **Root Directory**: `backend`
   - **Build**: `npm install`
   - **Start**: `npm start`
5. Environment Variables (click "Add Environment Variable"):
   ```
   PORT = 5000
   MONGO_URI = <paste-your-mongodb-connection-string>
   GEMINI_API_KEY = <your-gemini-key>
   CORS_ORIGIN = *
   ```
6. Create Web Service → Wait 5-10 min
7. Copy URL: `https://cognify-api-xxxx.onrender.com`
8. Test: Visit `https://your-url.com/api/health`

---

## Step 3: Deploy Frontend to Vercel (5 min)

1. Go to https://vercel.com → Sign up with GitHub
2. Add New → Project → Import your repo
3. Settings:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Environment Variables:
   ```
   VITE_API_URL = https://cognify-api-xxxx.onrender.com/api
   ```
   (Use your backend URL from Step 2)
5. Deploy → Wait 2-5 min
6. Copy URL: `https://cognify-xxxx.vercel.app`

---

## Step 4: Update Backend CORS (2 min)

1. Go back to Render → Your service → Environment
2. Edit `CORS_ORIGIN`:
   ```
   https://cognify-xxxx.vercel.app
   ```
   (Use your frontend URL from Step 3)
3. Save → Auto-redeploys

---

## Step 5: Configure Extension (5 min)

Edit these 4 files:

### 1. `extension/config.js`
```javascript
const API_URL = 'https://cognify-api-xxxx.onrender.com/api';
```

### 2. `extension/blocked.html` (line 193)
```html
<a href="https://cognify-xxxx.vercel.app" class="btn">Go to Dashboard</a>
```

### 3. `extension/inject-userid.js` (line 4)
```javascript
if (window.location.hostname === 'cognify-xxxx.vercel.app') {
```

### 4. `extension/manifest.json` (line 26)
```json
{
  "matches": ["https://cognify-xxxx.vercel.app/*"],
  "js": ["inject-userid.js"]
}
```

---

## Step 6: Load Extension (3 min)

1. Chrome → `chrome://extensions`
2. Enable "Developer mode"
3. "Load unpacked" → Select `extension` folder
4. Copy Extension ID
5. Pin to toolbar

---

## Step 7: Final CORS Update (2 min)

1. Render → Environment → Edit `CORS_ORIGIN`:
   ```
   https://cognify-xxxx.vercel.app,chrome-extension://YOUR_EXTENSION_ID
   ```
2. Save

---

## Test Everything (3 min)

✅ Backend: `https://your-backend.com/api/health`
✅ Frontend: `https://your-frontend.com`
✅ Extension: Browse any site → See timer
✅ Dashboard: Should show tracking data
✅ Focus Mode: Block a site → Test it
✅ Chatbot: Send message → Get response

---

## Done! 🎉

Your URLs:
- **Dashboard**: `https://cognify-xxxx.vercel.app`
- **API**: `https://cognify-api-xxxx.onrender.com`

Share the dashboard URL with users!

---

## Common Issues

**"Failed to fetch"** → Check CORS_ORIGIN includes your frontend URL

**Extension not tracking** → Verify API_URL in extension/config.js

**No data in dashboard** → Browse websites for 1-2 minutes, then refresh

**Backend sleeping** → Free tier sleeps after 15min inactivity (30s wake time)

---

## Upgrade Later

For production use:
- Render: $7/month (no sleep, faster)
- MongoDB Atlas: $9/month (more storage)
- Vercel: Free is fine for most use cases

Total: ~$16/month for production-ready hosting
