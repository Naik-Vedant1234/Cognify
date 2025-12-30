import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  blockedDomains: [{ type: String }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  actualEndTime: { type: Date }, // When user manually ended the session
  duration: { type: Number, required: true }, // Planned duration in minutes
  actualDuration: { type: Number }, // Actual duration in minutes (if ended early)
  isActive: { type: Boolean, default: true, index: true }
});

export default mongoose.model('FocusSession', focusSessionSchema);
