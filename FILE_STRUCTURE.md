# Cognify - Complete File Structure

## Visual Project Tree

```
cognify/
│
├── 📄 START_HERE.md                    ← Begin here!
├── 📄 QUICK_START.md                   ← 5-minute setup
├── 📄 SETUP_GUIDE.md                   ← Detailed installation
├── 📄 IMPLEMENTATION_STEPS.md          ← Step-by-step guide
├── 📄 README.md                        ← Main documentation
├── 📄 PROJECT_OVERVIEW.md              ← Architecture overview
├── 📄 ARCHITECTURE.md                  ← Technical deep dive
├── 📄 CHECKLIST.md                     ← Testing checklist
├── 📄 FILE_STRUCTURE.md                ← This file
│
├── 📄 package.json                     ← Root dependencies
├── 📄 .gitignore                       ← Git ignore rules
├── 📄 start-dev.bat                    ← Quick start script (Windows)
│
├── 📁 backend/                         ← Node.js API Server
│   ├── 📄 server.js                    ← Main server entry point
│   ├── 📄 package.json                 ← Backend dependencies
│   ├── 📄 .env.example                 ← Environment template
│   ├── 📄 .env                         ← Your config (create this)
│   │
│   ├── 📁 models/                      ← Database schemas
│   │   ├── 📄 TimeEntry.js             ← Time tracking model
│   │   └── 📄 FocusSession.js          ← Focus mode model
│   │
│   └── 📁 routes/                      ← API endpoints
│       ├── 📄 timeTracking.js          ← Time tracking API
│       ├── 📄 focusMode.js             ← Focus mode API
│       └── 📄 chatbot.js               ← AI chatbot API
│
├── 📁 frontend/                        ← React Dashboard
│   ├── 📄 index.html                   ← HTML entry point
│   ├── 📄 package.json                 ← Frontend dependencies
│   ├── 📄 vite.config.js               ← Vite configuration
│   │
│   └── 📁 src/                         ← Source code
│       ├── 📄 main.jsx                 ← React entry point
│       ├── 📄 App.jsx                  ← Main app component
│       ├── 📄 App.css                  ← App styles
│       ├── 📄 index.css                ← Global styles
│       │
│       └── 📁 components/              ← React components
│           ├── 📄 Dashboard.jsx        ← Analytics dashboard
│           ├── 📄 Dashboard.css        ← Dashboard styles
│           ├── 📄 FocusMode.jsx        ← Focus mode UI
│           ├── 📄 FocusMode.css        ← Focus mode styles
│           ├── 📄 Chatbot.jsx          ← AI chat interface
│           └── 📄 Chatbot.css          ← Chatbot styles
│
└── 📁 extension/                       ← Chrome Extension
    ├── 📄 manifest.json                ← Extension configuration
    ├── 📄 package.json                 ← Extension metadata
    │
    ├── 📄 background.js                ← Background service worker
    ├── 📄 content.js                   ← Content script (timer)
    ├── 📄 content.css                  ← Timer styles
    ├── 📄 popup.html                   ← Extension popup UI
    ├── 📄 popup.js                     ← Popup logic
    │
    └── 📁 icons/                       ← Extension icons
        ├── 📄 README.md                ← Icon instructions
        ├── 🖼️ icon16.png               ← 16x16 icon (create this)
        ├── 🖼️ icon48.png               ← 48x48 icon (create this)
        └── 🖼️ icon128.png              ← 128x128 icon (create this)
```

## File Descriptions

### 📚 Documentation Files (Root)

| File | Purpose | When to Read |
|------|---------|--------------|
| `START_HERE.md` | Project introduction | First thing |
| `QUICK_START.md` | Fast setup guide | When starting |
| `SETUP_GUIDE.md` | Detailed installation | For thorough setup |
| `IMPLEMENTATION_STEPS.md` | Step-by-step tutorial | Learning the system |
| `README.md` | Main documentation | Overview and usage |
| `PROJECT_OVERVIEW.md` | Architecture overview | Understanding design |
| `ARCHITECTURE.md` | Technical details | Deep dive |
| `CHECKLIST.md` | Testing checklist | Verification |
| `FILE_STRUCTURE.md` | This file | Understanding structure |

### 🔧 Configuration Files (Root)

| File | Purpose | Action Required |
|------|---------|-----------------|
| `package.json` | Root dependencies | Run `npm install` |
| `.gitignore` | Git ignore rules | No action needed |
| `start-dev.bat` | Quick start script | Run to start all |

### 🖥️ Backend Files

#### Main Files
```
backend/
├── server.js           ← Express server setup, routes, MongoDB connection
├── package.json        ← Dependencies: express, mongoose, cors, dotenv, @google/generative-ai
├── .env.example        ← Template for environment variables
└── .env               ← YOUR configuration (create from .env.example)
```

#### Models (Database Schemas)
```
backend/models/
├── TimeEntry.js        ← Schema: userId, url, domain, title, duration, timestamp, favicon
└── FocusSession.js     ← Schema: userId, blockedDomains, startTime, endTime, duration, isActive
```

#### Routes (API Endpoints)
```
backend/routes/
├── timeTracking.js     ← POST /log, GET /stats/:userId, GET /timeline/:userId
├── focusMode.js        ← POST /start, GET /active/:userId, POST /end/:id, GET /check/:userId/:domain
└── chatbot.js          ← POST /message (Gemini AI integration)
```

### 🎨 Frontend Files

#### Main Files
```
frontend/
├── index.html          ← HTML template with root div
├── package.json        ← Dependencies: react, react-dom, react-router-dom, recharts, axios, lucide-react
├── vite.config.js      ← Vite configuration (port 5173)
└── src/
    ├── main.jsx        ← ReactDOM.render entry point
    ├── App.jsx         ← Router, navigation, user ID management
    ├── App.css         ← Navigation and layout styles
    └── index.css       ← Global styles and gradients
```

#### Components
```
frontend/src/components/
├── Dashboard.jsx       ← Analytics with charts (Bar, Pie, Line), stats cards, period filters
├── Dashboard.css       ← Dashboard styling, chart containers, responsive grid
├── FocusMode.jsx       ← Focus mode UI, site blocker, timer, session management
├── FocusMode.css       ← Focus mode styling, timer display, site tags
├── Chatbot.jsx         ← Chat interface, message history, AI integration
└── Chatbot.css         ← Chat styling, message bubbles, input area
```

### 🔌 Extension Files

#### Core Files
```
extension/
├── manifest.json       ← Extension config: permissions, content scripts, background worker
├── package.json        ← Extension metadata
├── background.js       ← Service worker: tab tracking, time logging, focus mode checks
├── content.js          ← Injected script: creates and updates timer overlay
├── content.css         ← Timer styling: gradient badge, animations
├── popup.html          ← Extension popup: stats display, dashboard link
└── popup.js            ← Popup logic: fetch and display stats
```

#### Icons (Create These)
```
extension/icons/
├── README.md           ← Instructions for creating icons
├── icon16.png          ← 16x16 toolbar icon (create this)
├── icon48.png          ← 48x48 management icon (create this)
└── icon128.png         ← 128x128 store icon (create this)
```

## File Relationships

### Data Flow
```
Extension (content.js)
    ↓ Creates timer overlay
    ↓
Extension (background.js)
    ↓ Tracks time
    ↓ POST /api/tracking/log
    ↓
Backend (timeTracking.js)
    ↓ Saves to MongoDB
    ↓
Backend (TimeEntry model)
    ↓ Stores data
    ↓
Frontend (Dashboard.jsx)
    ↓ GET /api/tracking/stats
    ↓ Displays charts
```

### Component Dependencies
```
Frontend App.jsx
    ├── Dashboard.jsx
    │   └── Uses: axios, recharts
    ├── FocusMode.jsx
    │   └── Uses: axios, lucide-react
    └── Chatbot.jsx
        └── Uses: axios, lucide-react

Backend server.js
    ├── timeTracking.js
    │   └── Uses: TimeEntry model
    ├── focusMode.js
    │   └── Uses: FocusSession model
    └── chatbot.js
        └── Uses: @google/generative-ai

Extension manifest.json
    ├── background.js
    │   └── Calls: Backend API
    ├── content.js
    │   └── Injects: Timer overlay
    └── popup.html
        └── Uses: popup.js
```

## File Sizes (Approximate)

```
Documentation:
├── START_HERE.md              ~5 KB
├── QUICK_START.md             ~3 KB
├── SETUP_GUIDE.md             ~8 KB
├── IMPLEMENTATION_STEPS.md    ~12 KB
├── README.md                  ~6 KB
├── PROJECT_OVERVIEW.md        ~10 KB
├── ARCHITECTURE.md            ~15 KB
└── CHECKLIST.md               ~10 KB

Backend:
├── server.js                  ~1 KB
├── models/TimeEntry.js        ~0.5 KB
├── models/FocusSession.js     ~0.5 KB
├── routes/timeTracking.js     ~3 KB
├── routes/focusMode.js        ~2 KB
└── routes/chatbot.js          ~1 KB

Frontend:
├── App.jsx                    ~2 KB
├── Dashboard.jsx              ~5 KB
├── FocusMode.jsx              ~4 KB
├── Chatbot.jsx                ~3 KB
└── CSS files                  ~2 KB each

Extension:
├── manifest.json              ~1 KB
├── background.js              ~3 KB
├── content.js                 ~1 KB
├── popup.html                 ~1 KB
└── popup.js                   ~1 KB

Total Project Size: ~100 KB (code only)
With node_modules: ~500 MB
```

## Important Files to Edit

### Must Edit (Required)
```
✅ backend/.env                 ← Add your Gemini API key
```

### Should Edit (Recommended)
```
📝 extension/icons/*.png        ← Create your extension icons
```

### Can Edit (Optional)
```
🎨 All .css files              ← Customize colors and styles
🔧 All .jsx files              ← Add features and modify UI
⚙️ backend/routes/*.js         ← Add new API endpoints
```

## Files You Don't Need to Touch

```
❌ package.json files          ← Dependencies are set
❌ vite.config.js              ← Configuration is correct
❌ manifest.json               ← Extension config is complete
❌ .gitignore                  ← Ignore rules are set
```

## File Creation Order (How This Was Built)

1. **Backend Structure**
   - server.js
   - Models (TimeEntry, FocusSession)
   - Routes (timeTracking, focusMode, chatbot)
   - package.json, .env.example

2. **Frontend Structure**
   - index.html, main.jsx, App.jsx
   - Components (Dashboard, FocusMode, Chatbot)
   - CSS files
   - package.json, vite.config.js

3. **Extension Structure**
   - manifest.json
   - background.js, content.js
   - popup.html, popup.js
   - content.css

4. **Documentation**
   - README.md
   - SETUP_GUIDE.md
   - QUICK_START.md
   - All other guides

## Next Steps

1. **Read**: START_HERE.md
2. **Setup**: Follow QUICK_START.md
3. **Verify**: Use CHECKLIST.md
4. **Customize**: Edit CSS and add features
5. **Deploy**: Follow deployment guides

---

**Need to find a specific file?**
Use this structure as your map! Every file has a purpose and location.
