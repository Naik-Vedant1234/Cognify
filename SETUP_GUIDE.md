# Cognify Setup Guide

Follow these steps to get Cognify running on your system.

## Step-by-Step Setup

### 1. Install Node.js and MongoDB

**Node.js:**
- Download from https://nodejs.org/ (v18 or higher)
- Verify installation: `node --version`

**MongoDB:**
- Download from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
- Start MongoDB: `mongod` (if local)

### 2. Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key for later use

### 3. Install Project Dependencies

Open terminal in the project root and run:

```bash
npm run install:all
```

This installs dependencies for backend, frontend, and extension.

### 4. Configure Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Create `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```

3. Edit `.env` with your settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cognify
GEMINI_API_KEY=your_actual_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
```

### 5. Start the Backend Server

In the backend folder:
```bash
npm run dev
```

You should see: "Server running on port 5000" and "MongoDB connected"

### 6. Start the Frontend

Open a NEW terminal, navigate to frontend folder:
```bash
cd frontend
npm run dev
```

You should see: "Local: http://localhost:5173"

### 7. Install Chrome Extension

1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Navigate to and select the `extension` folder
6. The Cognify extension icon should appear in your toolbar

### 8. Create Extension Icons (Optional)

The extension needs icons. You can:
- Create your own 16x16, 48x48, and 128x128 PNG icons
- Place them in `extension/icons/` folder
- Name them: `icon16.png`, `icon48.png`, `icon128.png`

Or use placeholder icons temporarily (extension will still work).

## Testing the Setup

1. **Test Backend**: Visit http://localhost:5000/api/health
   - Should show: `{"status":"ok","message":"Cognify API is running"}`

2. **Test Frontend**: Visit http://localhost:5173
   - Should see the Cognify dashboard

3. **Test Extension**: 
   - Click the Cognify icon in Chrome toolbar
   - Should see popup with stats
   - Browse any website - timer should appear in top-right

4. **Test Focus Mode**:
   - Go to http://localhost:5173/focus
   - Add a website (e.g., youtube.com)
   - Set duration and start
   - Try visiting that site - should redirect to blocked page

5. **Test Chatbot**:
   - Go to http://localhost:5173/chat
   - Ask a question about time management
   - Should get AI response

## Common Issues

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check MONGODB_URI in `.env`

**Extension Not Tracking:**
- Verify backend is running on port 5000
- Check browser console for errors
- Reload the extension

**Charts Not Showing:**
- Browse some websites first to generate data
- Wait a minute for data to sync
- Refresh the dashboard

**Chatbot Not Working:**
- Verify Gemini API key in `.env`
- Check backend console for errors
- Ensure you have internet connection

## Next Steps

- Customize the UI colors and styling
- Add more analytics features
- Implement user authentication
- Deploy to production

Enjoy using Cognify! 🎉
