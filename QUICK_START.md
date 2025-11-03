# Cognify - Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js installed (v18+)
- [ ] MongoDB installed and running
- [ ] Gemini API key obtained
- [ ] Chrome browser

## Installation (5 minutes)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Backend
```bash
cd backend
copy .env.example .env
# Edit .env with your MongoDB URI and Gemini API key
```

### 3. Start Everything
```bash
# Option A: Use the batch file (Windows)
start-dev.bat

# Option B: Manual start
# Terminal 1:
cd backend
npm run dev

# Terminal 2:
cd frontend
npm run dev
```

### 4. Load Extension
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder

## Verify Installation

✅ Backend running: http://localhost:5000/api/health
✅ Frontend running: http://localhost:5173
✅ Extension loaded: Check Chrome toolbar for icon

## First Use

1. **Browse any website** - Timer appears in top-right
2. **Open dashboard** - http://localhost:5173
3. **Try focus mode** - Block a site and test it
4. **Chat with AI** - Ask for productivity tips

## File Structure
```
cognify/
├── backend/          # API server (Node.js + MongoDB)
├── frontend/         # Dashboard (React)
├── extension/        # Chrome extension
├── README.md         # Main documentation
├── SETUP_GUIDE.md    # Detailed setup
└── start-dev.bat     # Quick start script
```

## Common Commands

```bash
# Install all dependencies
npm run install:all

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

## Need Help?

- Read `SETUP_GUIDE.md` for detailed instructions
- Read `PROJECT_OVERVIEW.md` for architecture details
- Check browser console for errors
- Verify MongoDB is running
- Check backend terminal for API errors

## Quick Tips

💡 Extension tracks time every minute
💡 Dashboard updates when you refresh
💡 Focus mode blocks sites in real-time
💡 AI chatbot needs internet connection
💡 All data is stored locally in MongoDB

Happy tracking! 🚀
