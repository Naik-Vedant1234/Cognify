import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  blockedDomains: [{ type: String }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  isActive: { type: Boolean, default: true, index: true }
});

export default mongoose.model('FocusSession', focusSessionSchema);
