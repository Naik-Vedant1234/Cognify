# Cognify - Project File Structure

## Root Directory
```
cognify/
├── backend/                    # Node.js/Express API server
├── frontend/                   # React dashboard application
├── extension/                  # Chrome extension
├── .deployment/                # Deployment artifacts
├── .git/                       # Git repository
├── .vscode/                    # VS Code settings
├── .gitignore                  # Git ignore rules
├── LICENSE                     # MIT License
├── README.md                   # Project documentation
├── package.json                # Root package.json
├── vercel.json                 # Vercel deployment config
├── render.yaml                 # Render deployment config
└── [Documentation Files]       # Various .md files
```

## Backend (`/backend`)
```
backend/
├── models/                     # MongoDB/Mongoose models
│   ├── FocusSession.js        # Focus mode session model
│   ├── TimeEntry.js           # Time tracking entry model
│   └── User.js                # User authentication model
├── routes/                     # Express route handlers
│   ├── auth.js                # Login/signup endpoints
│   ├── chatbot.js             # AI chatbot (Gemini)
│   ├── chatbot-alternative.js # Alternative chatbot
│   ├── focusMode.js           # Focus mode API
│   └── timeTracking.js        # Time tracking API
├── node_modules/              # Dependencies
├── .env                       # Environment variables (not in git)
├── .env.example               # Example environment file
├── .env.production.example    # Production env example
├── cleanup-invalid-domains.js # Utility script
├── package.json               # Backend dependencies
├── package-lock.json          # Locked dependencies
└── server.js                  # Express server entry point
```

### Backend Environment Variables (.env)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key (optional)
PORT=5000
```

## Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/            # React components
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── Dashboard.css      # Dashboard styles
│   │   ├── FocusMode.jsx      # Focus mode UI
│   │   ├── FocusMode.css      # Focus mode styles
│   │   ├── LandingPage.jsx    # Landing page
│   │   ├── LandingPage.css    # Landing page styles
│   │   ├── ExtensionDownload.jsx  # Extension download page
│   │   ├── ExtensionDownload.css  # Download page styles
│   │   ├── Login.jsx          # Login/signup page
│   │   ├── Login.css          # Login styles
│   │   ├── Chatbot.jsx        # Chatbot component
│   │   ├── Chatbot.css        # Chatbot styles
│   │   ├── FloatingChatbot.jsx    # Floating chatbot
│   │   └── FloatingChatbot.css    # Floating chatbot styles
│   ├── config/
│   │   └── api.js             # API URL configuration
│   ├── App.jsx                # Main app component
│   ├── App.css                # App styles
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
│   ├── cognify-extension.zip  # Extension download
│   └── README.md              # Public folder docs
├── dist/                      # Build output (generated)
├── node_modules/              # Dependencies
├── .env.production            # Production environment
├── index.html                 # HTML template
├── package.json               # Frontend dependencies
├── package-lock.json          # Locked dependencies
└── vite.config.js             # Vite configuration
```

## Extension (`/extension`)
```
extension/
├── icons/                     # Extension icons
│   ├── icon16.png            # 16x16 toolbar icon
│   ├── icon48.png            # 48x48 management icon
│   └── icon144.png           # 144x144 high-DPI icon
├── background.js             # Service worker (background script)
├── content.js                # Content script (runs on pages)
├── content.css               # Content script styles
├── popup.html                # Extension popup UI
├── popup.js                  # Popup logic
├── blocked.html              # Blocked site page
├── config.js                 # API configuration
├── inject-userid.js          # User ID sync script
├── manifest.json             # Extension manifest (v3)
├── INSTALLATION_GUIDE.txt    # Installation instructions
├── auth.html                 # Auth page (unused)
├── auth.js                   # Auth logic (unused)
├── package.json              # Extension metadata
└── package-lock.json         # Locked dependencies
```

## Documentation Files (Root)
```
├── ACCOUNT_SYSTEM.md          # Account system documentation
├── ACTIVE_TIME_TRACKING.md    # Active time tracking docs
├── ARCHITECTURE.md            # System architecture
├── CHROME_STORE_CHECKLIST.md  # Chrome Web Store checklist
├── CHROME_WEB_STORE_SUBMISSION.md  # Store submission guide
├── DEPLOY_CHECKLIST.md        # Deployment checklist
├── DEPLOYMENT.md              # Deployment guide
├── EXTENSION_DISTRIBUTION.md  # Extension distribution strategy
├── FILE_STRUCTURE.md          # This file
├── IMPLEMENTATION_STEPS.md    # Implementation steps
├── LANDING_PAGE_SUMMARY.md    # Landing page documentation
├── PUBLISH_EXTENSION.md       # Publishing guide
├── QUICK_START.md             # Quick start guide
└── SETUP_GUIDE.md             # Setup instructions
```

## Utility Scripts (Root)
```
├── package-extension.bat      # Package extension to ZIP
├── update-urls.bat            # Update URLs script
└── extension.zip              # Packaged extension (generated)
```

## Configuration Files (Root)
```
├── .gitignore                 # Git ignore patterns
├── vercel.json                # Vercel deployment config
├── render.yaml                # Render deployment config
├── package.json               # Root package.json
└── package-lock.json          # Root locked dependencies
```

## Deployment Structure

### Production URLs
- **Frontend**: https://cognify-theta.vercel.app (Vercel)
- **Backend**: https://cognify-gxaa.onrender.com (Render)
- **Database**: MongoDB Atlas

### Environment Variables by Service

**Render (Backend)**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `GEMINI_API_KEY` - Google Gemini API key (optional)
- `PORT` - Server port (auto-set by Render)

**Vercel (Frontend)**
- `VITE_API_URL` - Backend API URL (optional, defaults to production)

**Extension**
- Hardcoded API URL in `config.js` and `background.js`
- Points to: `https://cognify-gxaa.onrender.com/api`

## Key Files Explained

### Backend
- **server.js**: Express server setup, CORS, routes
- **models/**: MongoDB schemas using Mongoose
- **routes/**: API endpoint handlers

### Frontend
- **App.jsx**: Main app with routing and auth
- **components/**: React components for each page
- **config/api.js**: API URL configuration

### Extension
- **manifest.json**: Extension configuration (Manifest V3)
- **background.js**: Service worker for time tracking and blocking
- **content.js**: Runs on web pages, shows timer overlay
- **popup.html/js**: Extension popup interface
- **inject-userid.js**: Syncs user ID between extension and dashboard

## Build Outputs (Generated, Not in Git)

```
backend/node_modules/          # Backend dependencies
frontend/node_modules/         # Frontend dependencies
frontend/dist/                 # Frontend build output
extension.zip                  # Packaged extension
frontend/public/cognify-extension.zip  # Extension for download
```

## Git Ignored Files

```
node_modules/                  # All dependencies
.env                          # Environment variables
dist/                         # Build outputs
*.log                         # Log files
.DS_Store                     # macOS files
```

## Development Workflow

1. **Backend**: `cd backend && npm run dev`
2. **Frontend**: `cd frontend && npm run dev`
3. **Extension**: Load unpacked from `chrome://extensions`

## Production Deployment

1. **Backend**: Auto-deploys from GitHub to Render
2. **Frontend**: Auto-deploys from GitHub to Vercel
3. **Extension**: Manual download from website

---

**Last Updated**: December 31, 2024
**Version**: 1.0.0
**License**: MIT
