import express from 'express';
import TimeEntry from '../models/TimeEntry.js';

const router = express.Router();

router.post('/log', async (req, res) => {
  try {
    const { userId, url, domain, title, duration, favicon } = req.body;

    // Filter out invalid domains (chrome extensions, localhost, etc.)
    const invalidDomains = [
      'localhost',
      'chrome-extension://',
      '127.0.0.1',
      'chrome://',
      'about:',
      'edge://',
      'brave://'
    ];

    // Check if domain is invalid or looks like random characters
    const isInvalid = invalidDomains.some(invalid => domain.includes(invalid)) ||
      domain.length > 50 || // Too long, probably extension ID
      !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain); // Not a valid domain format

    if (isInvalid) {
      console.log('Skipping invalid domain:', domain);
      return res.json({ success: true, skipped: true });
    }

    console.log('Received time log:', { userId, domain, duration });

    const entry = new TimeEntry({ userId, url, domain, title, duration, favicon });
    await entry.save();

    console.log('Time entry saved successfully:', entry._id);
    res.json({ success: true, entry });
  } catch (error) {
    console.error('Error saving time entry:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'day' } = req.query;

    console.log('Stats request:', { userId, period });

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'hour':
        startDate.setHours(now.getHours() - 1);
        break;
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const entries = await TimeEntry.find({
      userId,
      timestamp: { $gte: startDate }
    });

    console.log(`Found ${entries.length} entries for user ${userId}`);

    // Filter out invalid domains
    const validEntries = entries.filter(entry => {
      const domain = entry.domain;
      const isValid = domain &&
        domain.length <= 50 &&
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain) &&
        !domain.includes('chrome-extension') &&
        !domain.includes('localhost');
      return isValid;
    });

    console.log(`${validEntries.length} valid entries after filtering`);

    const domainStats = validEntries.reduce((acc, entry) => {
      if (!acc[entry.domain]) {
        acc[entry.domain] = { domain: entry.domain, duration: 0, visits: 0, favicon: entry.favicon };
      }
      acc[entry.domain].duration += entry.duration;
      acc[entry.domain].visits += 1;
      return acc;
    }, {});

    const stats = Object.values(domainStats).sort((a, b) => b.duration - a.duration);
    const totalTime = stats.reduce((sum, s) => sum + s.duration, 0);

    console.log('Returning stats:', { statsCount: stats.length, totalTime });
    res.json({ stats, totalTime, period });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/timeline/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    const startDate = date ? new Date(date) : new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const entries = await TimeEntry.find({
      userId,
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: 1 });

    const hourlyData = Array(24).fill(0).map((_, i) => ({ hour: i, duration: 0 }));

    entries.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      hourlyData[hour].duration += entry.duration;
    });

    res.json({ timeline: hourlyData, entries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
