import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import timeTrackingRoutes from './routes/timeTracking.js';
import focusModeRoutes from './routes/focusMode.js';
import chatbotRoutes from './routes/chatbot-alternative.js';

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

const app = express();

const allowedOrigins = [
  "https://cognify.vercel.app",
  "chrome-extension://YOUR_EXTENSION_ID"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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
