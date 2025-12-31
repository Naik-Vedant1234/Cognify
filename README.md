# Cognify - Student Time Tracking Platform

A comprehensive productivity platform combining a Chrome extension and web dashboard to help students monitor and manage their browsing time.

## Features

- **Real-time Time Tracking**: Automatically tracks time spent on websites (only active time)
- **Interactive Dashboard**: Beautiful charts showing hourly, daily, monthly, and yearly analytics
- **Focus Mode**: Block distracting websites for a set duration with smart recommendations
- **Timer Overlay**: Dynamic clock icon on every website showing current session time
- **AI Chatbot**: Gemini-powered assistant for time management advice
- **Analytics**: Detailed breakdowns with graphs and statistics
- **Landing Page**: Beautiful landing page explaining features and providing download
- **Extension Download**: Easy manual installation with step-by-step guide
- **Cross-Browser Support**: Works on Chrome, Brave, Edge, and all Chromium browsers
- **Account System**: Secure authentication with JWT tokens
- **Privacy First**: Your data is private and never sold to third parties

## Project Structure

```
cognify/
├── backend/          # Node.js/Express API
├── frontend/         # React dashboard
├── extension/        # Chrome extension
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Gemini API key

### Step 1: Install Dependencies

```bash
npm run install:all
```

### Step 2: Configure Backend

1. Copy `.env.example` to `.env` in the backend folder:
```bash
cd backend
copy .env.example .env
```

2. Edit `.env` and add your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cognify
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system.

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

The API will run on http://localhost:5000

### Step 5: Start Frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

The dashboard will run on http://localhost:5173

### Step 6: Load Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `extension` folder
5. The Cognify extension is now active!

## Usage

1. **Visit the website** - Go to https://cognify-theta.vercel.app to learn about Cognify
2. **Download extension** - Click "Download Extension" and follow installation steps
3. **Create account** - Sign up for free to sync your data
4. **Browse normally** - The extension automatically tracks your time
5. **View the timer** - Look for the purple timer in the top-right of each page
6. **Check your dashboard** - View detailed analytics and insights
7. **Enable Focus Mode** - Block distracting sites when you need to concentrate
8. **Chat with AI** - Get productivity tips from the AI assistant (if enabled)

## API Endpoints

### Time Tracking
- `POST /api/tracking/log` - Log time entry
- `GET /api/tracking/stats/:userId` - Get statistics
- `GET /api/tracking/timeline/:userId` - Get hourly timeline

### Focus Mode
- `POST /api/focus/start` - Start focus session
- `GET /api/focus/active/:userId` - Check active session
- `POST /api/focus/end/:sessionId` - End session
- `GET /api/focus/check/:userId/:domain` - Check if domain is blocked

### Chatbot
- `POST /api/chat/message` - Send message to AI assistant

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Recharts, Axios, Lucide Icons
- **Extension**: Chrome Extension API (Manifest V3)
- **AI**: Google Gemini API

## Development Tips

- The extension logs time every minute and on tab changes
- Focus mode checks happen in real-time
- All data is stored per user ID (auto-generated)
- Charts update based on selected time period

## Troubleshooting

- **Extension not tracking**: Check if backend is running on port 5000
- **Charts not showing**: Ensure MongoDB is running and has data
- **Focus mode not working**: Verify the extension has proper permissions
- **Chatbot errors**: Check your Gemini API key in `.env`

## Deployment

Ready to deploy to production? **All localhost dependencies have been removed and the project is deployment-ready!**

See our deployment guides:

- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Deploy in 30 minutes (recommended)
- **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** - Step-by-step checklist
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide with all options
- **[DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md)** - What was fixed and current status

### Quick Deploy Summary

1. **Database**: MongoDB Atlas (free tier)
2. **Backend**: Render.com (free tier)
3. **Frontend**: Vercel (free tier)
4. **Extension**: Load locally or publish to Chrome Web Store

Total cost: **$0/month** with free tiers!

### Configuration Files

After deployment, update these files with your URLs:
- `extension/config.js` - Backend API URL
- `frontend/.env.production` - Backend API URL
- `extension/manifest.json` - Frontend URL
- `extension/blocked.html` - Frontend URL
- Backend environment variables on Render

Enjoy using Cognify! 🚀
