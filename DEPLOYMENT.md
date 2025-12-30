# Cognify Deployment Guide

This guide covers deploying Cognify to production with separate hosting for backend, frontend, and extension.

## Architecture Overview

- **Backend**: Node.js/Express API → Deploy to Render/Railway/Heroku
- **Database**: MongoDB → MongoDB Atlas (cloud)
- **Frontend**: React/Vite → Deploy to Vercel/Netlify
- **Extension**: Chrome Extension → Manual distribution or Chrome Web Store

---

## Prerequisites

- [ ] MongoDB Atlas account (free tier available)
- [ ] Render/Railway account for backend (free tier available)
- [ ] Vercel/Netlify account for frontend (free tier available)
- [ ] Google Gemini API key
- [ ] Git repository (GitHub/GitLab)

---

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist all IPs: `0.0.0.0/0` (for production, restrict this)
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/cognify?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend

### Option A: Render (Recommended - Free Tier)

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `cognify-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-atlas-connection-string>
   GEMINI_API_KEY=<your-gemini-api-key>
   CORS_ORIGIN=*
   JWT_SECRET=<generate-random-string>
   ```
7. Deploy and note your backend URL: `https://cognify-api.onrender.com`

### Option B: Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as above)
5. Railway will auto-detect Node.js and deploy

---

## Step 3: Deploy Frontend

### Option A: Vercel (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://cognify-api.onrender.com/api
   ```
6. Deploy and note your frontend URL: `https://cognify.vercel.app`

### Option B: Netlify

1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy

---

## Step 4: Update Backend CORS

After deploying frontend, update backend environment variables:

```env
CORS_ORIGIN=https://cognify.vercel.app
```

Or for multiple origins, update `backend/server.js`:
```javascript
const allowedOrigins = [
  "https://cognify.vercel.app",
  "chrome-extension://YOUR_EXTENSION_ID"
];
```

---

## Step 5: Configure Extension

1. Update `extension/config.js`:
   ```javascript
   const API_URL = 'https://cognify-api.onrender.com/api';
   ```

2. Update `extension/blocked.html` (line 193):
   ```html
   <a href="https://cognify.vercel.app" class="btn">Go to Dashboard</a>
   ```

3. Update `extension/inject-userid.js` (line 4):
   ```javascript
   if (window.location.hostname === 'cognify.vercel.app') {
   ```

4. Update `extension/manifest.json` content_scripts matches:
   ```json
   {
     "matches": ["https://cognify.vercel.app/*"],
     "js": ["inject-userid.js"],
     "run_at": "document_start"
   }
   ```

---

## Step 6: Package Extension

### For Testing:
1. Zip the `extension` folder
2. Load unpacked in Chrome (chrome://extensions)

### For Chrome Web Store:
1. Create a developer account ($5 one-time fee)
2. Prepare assets:
   - 128x128 icon
   - Screenshots
   - Description
3. Upload zip file
4. Submit for review

---

## Step 7: Update Extension ID in Backend

After loading extension in Chrome:
1. Go to `chrome://extensions`
2. Copy your extension ID
3. Update backend CORS to include:
   ```
   chrome-extension://YOUR_ACTUAL_EXTENSION_ID
   ```

---

## Verification Checklist

- [ ] Backend health check: `https://your-backend.com/api/health`
- [ ] Frontend loads: `https://your-frontend.com`
- [ ] Extension connects to backend (check console for errors)
- [ ] Time tracking works
- [ ] Focus mode blocks sites
- [ ] Chatbot responds
- [ ] Dashboard shows data

---

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
GEMINI_API_KEY=...
CORS_ORIGIN=https://your-frontend.com
JWT_SECRET=random-secret-string
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.com/api
```

### Extension (config.js)
```javascript
const API_URL = 'https://your-backend.com/api';
```

---

## Troubleshooting

### CORS Errors
- Ensure backend CORS_ORIGIN includes your frontend URL
- For extension, add `chrome-extension://EXTENSION_ID`

### Extension Can't Connect
- Check API_URL in `extension/config.js`
- Verify backend is running
- Check browser console for errors

### Database Connection Failed
- Verify MongoDB Atlas connection string
- Check IP whitelist (0.0.0.0/0 for testing)
- Ensure database user has correct permissions

### Frontend Build Fails
- Ensure `VITE_API_URL` is set
- Check Node.js version compatibility
- Clear node_modules and reinstall

---

## Cost Estimate (Free Tier)

- MongoDB Atlas: Free (512MB storage)
- Render: Free (750 hours/month, sleeps after inactivity)
- Vercel: Free (100GB bandwidth)
- **Total: $0/month**

Note: Free tier backends may sleep after inactivity (30s cold start).

---

## Production Recommendations

1. **Use paid tiers** for better performance (no cold starts)
2. **Restrict CORS** to specific domains
3. **Add rate limiting** to API endpoints
4. **Enable HTTPS** everywhere (automatic on Render/Vercel)
5. **Monitor logs** for errors
6. **Set up alerts** for downtime
7. **Regular backups** of MongoDB data

---

## Quick Deploy Commands

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run build

# Extension
cd extension
# Zip the folder and load in Chrome
```

---

## Support

For issues, check:
- Backend logs on Render dashboard
- Frontend logs on Vercel dashboard
- Browser console for extension errors
- MongoDB Atlas metrics for database issues
