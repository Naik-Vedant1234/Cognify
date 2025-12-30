# Deployment Checklist

Follow these steps in order to deploy Cognify to production.

## Phase 1: Database Setup (5 minutes)

- [ ] Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create a free cluster
- [ ] Create database user with strong password
- [ ] Whitelist IP: `0.0.0.0/0` (Network Access → Add IP Address)
- [ ] Get connection string from "Connect" → "Connect your application"
- [ ] Save connection string (format: `mongodb+srv://user:pass@cluster.mongodb.net/cognify`)

## Phase 2: Backend Deployment (10 minutes)

### Using Render (Recommended)

- [ ] Push code to GitHub if not already done
- [ ] Go to https://render.com and sign up
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure service:
  - Name: `cognify-api`
  - Root Directory: `backend`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Add environment variables:
  ```
  PORT=5000
  MONGO_URI=<paste-your-mongodb-connection-string>
  GEMINI_API_KEY=<your-gemini-api-key>
  CORS_ORIGIN=*
  ```
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Copy your backend URL (e.g., `https://cognify-api.onrender.com`)
- [ ] Test: Visit `https://your-backend-url.com/api/health`
  - Should show: `{"status":"ok","message":"Cognify API is running"}`

## Phase 3: Frontend Deployment (10 minutes)

### Using Vercel (Recommended)

- [ ] Go to https://vercel.com and sign up
- [ ] Click "Add New" → "Project"
- [ ] Import your GitHub repository
- [ ] Configure:
  - Framework Preset: `Vite`
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] Add Environment Variable:
  - Key: `VITE_API_URL`
  - Value: `https://your-backend-url.com/api` (from Phase 2)
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Copy your frontend URL (e.g., `https://cognify.vercel.app`)
- [ ] Test: Visit your frontend URL - should see Cognify dashboard

## Phase 4: Update Backend CORS (2 minutes)

- [ ] Go back to Render dashboard
- [ ] Click on your `cognify-api` service
- [ ] Go to "Environment" tab
- [ ] Update `CORS_ORIGIN` variable:
  - Value: `https://your-frontend-url.com` (from Phase 3)
- [ ] Click "Save Changes"
- [ ] Service will auto-redeploy

## Phase 5: Configure Extension (5 minutes)

- [ ] Open `extension/config.js` in your editor
- [ ] Update the API_URL:
  ```javascript
  const API_URL = 'https://your-backend-url.com/api';
  ```
- [ ] Open `extension/blocked.html`
- [ ] Find line 193 and update:
  ```html
  <a href="https://your-frontend-url.com" class="btn">Go to Dashboard</a>
  ```
- [ ] Open `extension/inject-userid.js`
- [ ] Update line 4 to match your frontend domain:
  ```javascript
  if (window.location.hostname === 'your-frontend-domain.com') {
  ```
- [ ] Open `extension/manifest.json`
- [ ] Update the content_scripts matches (around line 26):
  ```json
  {
    "matches": ["https://your-frontend-url.com/*"],
    "js": ["inject-userid.js"],
    "run_at": "document_start"
  }
  ```

## Phase 6: Load Extension (3 minutes)

- [ ] Open Chrome and go to `chrome://extensions`
- [ ] Enable "Developer mode" (top right)
- [ ] Click "Load unpacked"
- [ ] Select your `extension` folder
- [ ] Copy the Extension ID (looks like: `abcdefghijklmnopqrstuvwxyz123456`)
- [ ] Pin the extension to toolbar

## Phase 7: Update Backend CORS for Extension (2 minutes)

- [ ] Go back to Render dashboard
- [ ] Update `CORS_ORIGIN` to include extension:
  ```
  https://your-frontend-url.com,chrome-extension://YOUR_EXTENSION_ID
  ```
  (Replace YOUR_EXTENSION_ID with the ID from Phase 6)
- [ ] Save and wait for redeploy

## Phase 8: Testing (5 minutes)

- [ ] Test backend health: `https://your-backend-url.com/api/health`
  - Should return: `{"status":"ok",...}`
- [ ] Test frontend: Visit `https://your-frontend-url.com`
  - Should load dashboard
- [ ] Test extension:
  - [ ] Browse to any website (e.g., youtube.com)
  - [ ] Should see timer in top-right corner
  - [ ] Click extension icon - should show stats
- [ ] Test time tracking:
  - [ ] Browse 2-3 websites for 1 minute each
  - [ ] Go to dashboard
  - [ ] Should see data in charts
- [ ] Test focus mode:
  - [ ] Go to `https://your-frontend-url.com/focus`
  - [ ] Add a website (e.g., "youtube.com")
  - [ ] Start 5-minute session
  - [ ] Try to visit youtube.com
  - [ ] Should be blocked
- [ ] Test chatbot:
  - [ ] Go to `https://your-frontend-url.com/chat`
  - [ ] Send a message
  - [ ] Should get AI response

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify MONGO_URI is correct
- Ensure all environment variables are set

### Frontend shows errors
- Check browser console (F12)
- Verify VITE_API_URL is correct
- Check if backend is running

### Extension can't connect
- Verify API_URL in extension/config.js
- Check CORS settings in backend
- Look for errors in browser console
- Reload extension after changes

### CORS errors
- Ensure CORS_ORIGIN includes your frontend URL
- Add extension ID to CORS_ORIGIN
- Format: `https://frontend.com,chrome-extension://ID`

### Database connection failed
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has correct permissions

## Success Criteria

✅ Backend health check returns OK
✅ Frontend loads without errors
✅ Extension shows timer on websites
✅ Time tracking data appears in dashboard
✅ Focus mode blocks websites
✅ Chatbot responds to messages

## Next Steps

- [ ] Share frontend URL with users
- [ ] Distribute extension (zip file or Chrome Web Store)
- [ ] Monitor Render logs for errors
- [ ] Set up MongoDB backups
- [ ] Consider upgrading to paid tiers for better performance

## URLs to Save

- Backend: `https://_____________________.com`
- Frontend: `https://_____________________.com`
- Extension ID: `_____________________`
- MongoDB: `mongodb+srv://_____________________.net`

## Estimated Total Time: 40-45 minutes

Good luck with your deployment! 🚀
