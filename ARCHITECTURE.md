# Cognify - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         COGNIFY SYSTEM                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Chrome Browser  │      │   Web Browser    │      │   External APIs  │
│                  │      │                  │      │                  │
│  ┌────────────┐  │      │  ┌────────────┐  │      │  ┌────────────┐  │
│  │ Extension  │  │      │  │  Frontend  │  │      │  │  Gemini AI │  │
│  │            │  │      │  │ Dashboard  │  │      │  │    API     │  │
│  └────────────┘  │      │  └────────────┘  │      │  └────────────┘  │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                         │                         │
         │ HTTP/REST               │ HTTP/REST               │ HTTP/REST
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                         ┌─────────▼─────────┐
                         │   Backend API     │
                         │   (Express.js)    │
                         │                   │
                         │  Port: 5000       │
                         └─────────┬─────────┘
                                   │
                                   │ Mongoose ODM
                                   │
                         ┌─────────▼─────────┐
                         │    MongoDB        │
                         │   Database        │
                         │                   │
                         │  Port: 27017      │
                         └───────────────────┘
```

## Component Details

### 1. Chrome Extension
```
┌─────────────────────────────────────────┐
│         Chrome Extension                │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  background.js (Service Worker)   │  │
│  │  - Tracks active tabs             │  │
│  │  - Logs time every minute         │  │
│  │  - Checks focus mode              │  │
│  │  - Sends data to API              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  content.js (Injected Script)     │  │
│  │  - Creates timer overlay          │  │
│  │  - Updates every second           │  │
│  │  - Runs on all websites           │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  popup.html/js (Extension Popup)  │  │
│  │  - Shows quick stats              │  │
│  │  - Links to dashboard             │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Backend API
```
┌─────────────────────────────────────────┐
│           Backend Server                │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  server.js (Main Entry)           │  │
│  │  - Express setup                  │  │
│  │  - MongoDB connection             │  │
│  │  - Route registration             │  │
│  │  - CORS configuration             │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Routes                           │  │
│  │  ├─ /api/tracking/*               │  │
│  │  ├─ /api/focus/*                  │  │
│  │  └─ /api/chat/*                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Models                           │  │
│  │  ├─ TimeEntry                     │  │
│  │  └─ FocusSession                  │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Frontend Dashboard
```
┌─────────────────────────────────────────┐
│        React Frontend (Vite)            │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  App.jsx (Main Router)            │  │
│  │  - Navigation                     │  │
│  │  - Route management               │  │
│  │  - User ID management             │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Components                       │  │
│  │  ├─ Dashboard.jsx                 │  │
│  │  │   - Charts (Bar, Pie, Line)    │  │
│  │  │   - Statistics cards           │  │
│  │  │   - Period selector            │  │
│  │  │                                │  │
│  │  ├─ FocusMode.jsx                 │  │
│  │  │   - Site blocker UI            │  │
│  │  │   - Timer display              │  │
│  │  │   - Session management         │  │
│  │  │                                │  │
│  │  └─ Chatbot.jsx                   │  │
│  │      - Chat interface             │  │
│  │      - Message history            │  │
│  │      - AI integration             │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## Data Flow Diagrams

### Time Tracking Flow
```
User visits website
        │
        ▼
Extension detects tab change
        │
        ▼
content.js creates timer overlay
        │
        ▼
background.js starts tracking
        │
        ▼
Every 1 minute OR tab change
        │
        ▼
POST /api/tracking/log
        │
        ▼
Backend saves to MongoDB
        │
        ▼
Dashboard fetches data
        │
        ▼
GET /api/tracking/stats
        │
        ▼
Charts display data
```

### Focus Mode Flow
```
User enables focus mode
        │
        ▼
Selects sites + duration
        │
        ▼
POST /api/focus/start
        │
        ▼
Backend creates session
        │
        ▼
User tries to visit blocked site
        │
        ▼
Extension checks:
GET /api/focus/check/:userId/:domain
        │
        ├─ Not blocked ──> Load site normally
        │
        └─ Blocked ──> Redirect to /blocked page
```

### Chatbot Flow
```
User types message
        │
        ▼
POST /api/chat/message
        │
        ▼
Backend receives message
        │
        ▼
Calls Gemini API
        │
        ▼
Gemini generates response
        │
        ▼
Backend returns response
        │
        ▼
Frontend displays in chat
```

## Database Schema

### TimeEntry Collection
```javascript
{
  _id: ObjectId,
  userId: "user_abc123",
  url: "https://github.com/user/repo",
  domain: "github.com",
  title: "GitHub - user/repo",
  duration: 120,              // seconds
  timestamp: ISODate("2024-01-15T10:30:00Z"),
  favicon: "https://github.com/favicon.ico"
}
```

### FocusSession Collection
```javascript
{
  _id: ObjectId,
  userId: "user_abc123",
  blockedDomains: [
    "youtube.com",
    "facebook.com",
    "twitter.com"
  ],
  startTime: ISODate("2024-01-15T10:00:00Z"),
  endTime: ISODate("2024-01-15T10:25:00Z"),
  duration: 25,               // minutes
  isActive: true
}
```

## API Endpoints Reference

### Time Tracking API
```
POST   /api/tracking/log
Body:  { userId, url, domain, title, duration, favicon }
Response: { success: true, entry: {...} }

GET    /api/tracking/stats/:userId?period=day
Response: { stats: [...], totalTime: 3600, period: "day" }

GET    /api/tracking/timeline/:userId?date=2024-01-15
Response: { timeline: [...], entries: [...] }
```

### Focus Mode API
```
POST   /api/focus/start
Body:  { userId, blockedDomains: [...], duration: 25 }
Response: { success: true, session: {...} }

GET    /api/focus/active/:userId
Response: { active: true, session: {...} }

POST   /api/focus/end/:sessionId
Response: { success: true, session: {...} }

GET    /api/focus/check/:userId/:domain
Response: { blocked: true, session: {...} }
```

### Chatbot API
```
POST   /api/chat/message
Body:  { message: "How to be productive?", context: {...} }
Response: { success: true, response: "Here are some tips..." }
```

## Technology Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **AI**: Google Gemini API
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Extension
- **Manifest**: V3
- **APIs**: Chrome Tabs, Storage, Alarms
- **Permissions**: tabs, storage, alarms, webNavigation

## Security Considerations

### API Security
- CORS configured for specific origin
- No authentication (add JWT for production)
- Input validation needed
- Rate limiting recommended

### Extension Security
- Content Security Policy in manifest
- Minimal permissions requested
- No eval() or inline scripts
- Secure communication with backend

### Data Privacy
- User ID generated locally
- No personal information collected
- Data stored locally in MongoDB
- No third-party tracking

## Performance Optimization

### Extension
- Debounced time logging (1 minute intervals)
- Minimal DOM manipulation
- Efficient tab tracking
- Background service worker

### Backend
- Indexed database queries (userId, domain, timestamp)
- Aggregation pipelines for stats
- Connection pooling
- Async/await patterns

### Frontend
- Code splitting with React Router
- Lazy loading components
- Memoized chart data
- Optimized re-renders

## Scalability Considerations

### Current Limitations
- Single user per browser
- Local MongoDB instance
- No data synchronization
- Limited to Chrome browser

### Production Improvements
- Multi-user authentication
- Cloud database (MongoDB Atlas)
- Redis caching layer
- Load balancing
- CDN for frontend
- Microservices architecture

## Deployment Architecture

### Development
```
localhost:5000  ──> Backend API
localhost:5173  ──> Frontend Dashboard
localhost:27017 ──> MongoDB
```

### Production
```
api.cognify.com     ──> Backend (Heroku/Railway)
app.cognify.com     ──> Frontend (Vercel/Netlify)
MongoDB Atlas       ──> Database (Cloud)
Chrome Web Store    ──> Extension
```

## Monitoring & Logging

### Backend Logs
- API request/response
- Database operations
- Error tracking
- Performance metrics

### Extension Logs
- Time tracking events
- Focus mode checks
- API communication
- Error handling

### Frontend Logs
- User interactions
- API calls
- Chart rendering
- Navigation events

---

This architecture provides a solid foundation for a production-ready time tracking platform!
