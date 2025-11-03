import mongoose from 'mongoose';

const timeEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  url: { type: String, required: true },
  domain: { type: String, required: true, index: true },
  title: { type: String },
  duration: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  favicon: { type: String }
});

export default mongoose.model('TimeEntry', timeEntrySchema);
