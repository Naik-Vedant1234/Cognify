# Cognify - Step-by-Step Implementation Guide

## Phase 1: Environment Setup (15 minutes)

### Step 1.1: Install Required Software
```bash
# Download and install:
1. Node.js from https://nodejs.org/
2. MongoDB from https://www.mongodb.com/try/download/community
3. Chrome browser (if not already installed)
```

### Step 1.2: Get API Key
```bash
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (you'll need it soon)
```

### Step 1.3: Start MongoDB
```bash
# Open terminal and run:
mongod

# Keep this terminal open
# You should see "Waiting for connections on port 27017"
```

## Phase 2: Project Installation (10 minutes)

### Step 2.1: Install All Dependencies
```bash
# In project root directory:
npm run install:all

# This installs packages for:
# - Root project
# - Backend server
# - Frontend dashboard
# - Extension (minimal)
```

### Step 2.2: Configure Backend
```bash
# Navigate to backend folder:
cd backend

# Copy environment template:
copy .env.example .env

# Edit .env file with your text editor:
# - Keep PORT=5000
# - Keep MONGODB_URI=mongodb://localhost:27017/cognify
# - Replace GEMINI_API_KEY with your actual key
# - Keep CORS_ORIGIN=http://localhost:5173
```

## Phase 3: Start the Application (5 minutes)

### Step 3.1: Start Backend Server
```bash
# Open NEW terminal
# Navigate to backend:
cd backend

# Start server:
npm run dev

# You should see:
# "Server running on port 5000"
# "MongoDB connected"
```

### Step 3.2: Start Frontend Dashboard
```bash
# Open ANOTHER NEW terminal
# Navigate to frontend:
cd frontend

# Start development server:
npm run dev

# You should see:
# "Local: http://localhost:5173"
```

### Step 3.3: Load Chrome Extension
```bash
1. Open Chrome browser
2. Type in address bar: chrome://extensions/
3. Toggle "Developer mode" ON (top-right corner)
4. Click "Load unpacked" button
5. Navigate to your project folder
6. Select the "extension" folder
7. Click "Select Folder"
8. Extension should appear with Cognify name
```

## Phase 4: Testing (10 minutes)

### Test 4.1: Verify Backend
```bash
# Open browser and visit:
http://localhost:5000/api/health

# Should show:
{"status":"ok","message":"Cognify API is running"}
```

### Test 4.2: Verify Frontend
```bash
# Visit:
http://localhost:5173

# Should see:
# - Cognify logo and navigation
# - Dashboard with "Loading your data..." or empty charts
```

### Test 4.3: Test Extension Tracking
```bash
1. Visit any website (e.g., google.com)
2. Look for purple timer in top-right corner
3. Timer should count up (0:01, 0:02, etc.)
4. Click extension icon in Chrome toolbar
5. Should show popup with stats
```

### Test 4.4: Generate Some Data
```bash
1. Browse 3-4 different websites for 1-2 minutes each
2. Wait 1 minute for data to sync
3. Go back to http://localhost:5173
4. Refresh the page
5. Should now see charts with data
```

### Test 4.5: Test Focus Mode
```bash
1. Go to: http://localhost:5173/focus
2. Type a website domain (e.g., "youtube.com")
3. Click the + button to add it
4. Set duration to 5 minutes
5. Click "Start Focus Session"
6. Try visiting youtube.com in a new tab
7. Should redirect to blocked page
```

### Test 4.6: Test AI Chatbot
```bash
1. Go to: http://localhost:5173/chat
2. Type a message: "How can I be more productive?"
3. Click Send
4. Should receive AI response within a few seconds
```

## Phase 5: Understanding the System (5 minutes)

### How Time Tracking Works
```
1. You visit a website
2. Extension's content.js creates timer overlay
3. Extension's background.js tracks the tab
4. Every minute, background.js sends data to backend
5. Backend stores in MongoDB
6. Dashboard fetches and displays data
```

### How Focus Mode Works
```
1. You enable focus mode with blocked sites
2. Frontend sends to backend API
3. Backend stores focus session in MongoDB
4. Extension checks before loading any site
5. If site is blocked, redirects to blocked page
6. Session auto-expires after duration
```

### How Chatbot Works
```
1. You send a message in chat
2. Frontend sends to backend API
3. Backend calls Google Gemini API
4. Gemini generates response
5. Backend returns to frontend
6. Message appears in chat
```

## Phase 6: Customization (Optional)

### Change Theme Colors
```javascript
// Find and replace these colors in all CSS files:
#667eea → Your primary color
#764ba2 → Your secondary color

// Files to edit:
- frontend/src/App.css
- frontend/src/index.css
- frontend/src/components/*.css
- extension/content.css
```

### Modify Timer Position
```css
// Edit extension/content.css
#cognify-timer {
  top: 10px;    // Change this
  right: 10px;  // Change this
}
```

### Add More Chart Types
```javascript
// Edit frontend/src/components/Dashboard.jsx
// Import more chart types from recharts:
import { AreaChart, Area, RadarChart, Radar } from 'recharts';
```

## Troubleshooting Guide

### Problem: Extension not tracking
**Solution:**
```bash
1. Check if backend is running (http://localhost:5000/api/health)
2. Open Chrome DevTools (F12) → Console tab
3. Look for errors
4. Reload extension: chrome://extensions/ → Click reload icon
```

### Problem: Charts showing no data
**Solution:**
```bash
1. Browse some websites first
2. Wait at least 1 minute
3. Check MongoDB: Open MongoDB Compass or shell
4. Verify data exists in 'cognify' database
5. Refresh dashboard
```

### Problem: Focus mode not blocking
**Solution:**
```bash
1. Verify focus session is active (check dashboard)
2. Reload extension
3. Check backend logs for errors
4. Try blocking a different site
```

### Problem: Chatbot not responding
**Solution:**
```bash
1. Verify Gemini API key in backend/.env
2. Check backend terminal for errors
3. Test API key at https://makersuite.google.com/
4. Ensure internet connection is active
```

### Problem: MongoDB connection error
**Solution:**
```bash
1. Verify MongoDB is running (mongod command)
2. Check MONGODB_URI in backend/.env
3. Try: mongodb://127.0.0.1:27017/cognify
4. Restart MongoDB service
```

## Next Steps

### Immediate Improvements
- [ ] Create custom extension icons (16x16, 48x48, 128x128)
- [ ] Add more websites to test with
- [ ] Customize colors to your preference
- [ ] Test all features thoroughly

### Future Enhancements
- [ ] Add user authentication
- [ ] Create website categories
- [ ] Add productivity goals
- [ ] Implement notifications
- [ ] Add export to CSV feature
- [ ] Create mobile companion app

### Deployment
- [ ] Deploy backend to Heroku/Railway
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Publish extension to Chrome Web Store
- [ ] Set up MongoDB Atlas (cloud database)

## Support Resources

- **Main Documentation**: README.md
- **Setup Details**: SETUP_GUIDE.md
- **Architecture**: PROJECT_OVERVIEW.md
- **Quick Reference**: QUICK_START.md

## Success Checklist

- [x] MongoDB running
- [x] Backend server running on port 5000
- [x] Frontend running on port 5173
- [x] Extension loaded in Chrome
- [x] Timer appears on websites
- [x] Data shows in dashboard
- [x] Focus mode blocks sites
- [x] Chatbot responds

Congratulations! Cognify is now fully operational! 🎉
