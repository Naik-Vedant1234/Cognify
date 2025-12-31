import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import timeTrackingRoutes from './routes/timeTracking.js';
import focusModeRoutes from './routes/focusMode.js';
import chatbotRoutes from './routes/chatbot-alternative.js';
import authRoutes from './routes/auth.js';

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const app = express();

// CORS configuration - allow frontend and extension
const allowedOrigins = [
  "https://cognify-theta.vercel.app",
  "chrome-extension://dofaahdpjponmcjfcjkkjemipgabfapi"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/tracking', timeTrackingRoutes);
app.use('/api/focus', focusModeRoutes);
app.use('/api/chat', chatbotRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    service: "Cognify API",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
