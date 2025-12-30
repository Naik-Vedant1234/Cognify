import express from 'express';
import FocusSession from '../models/FocusSession.js';

const router = express.Router();

router.post('/start', async (req, res) => {
  try {
    const { userId, blockedDomains, duration } = req.body;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const session = new FocusSession({
      userId,
      blockedDomains,
      startTime,
      endTime,
      duration,
      isActive: true
    });

    await session.save();
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/active/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();

    const session = await FocusSession.findOne({
      userId,
      isActive: true,
      endTime: { $gt: now }
    });

    if (session && session.endTime < now) {
      session.isActive = false;
      await session.save();
      return res.json({ active: false });
    }

    res.json({ active: !!session, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/end/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const now = new Date();

    // Find the session
    const session = await FocusSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Calculate actual duration (in minutes)
    const actualDurationMs = now - new Date(session.startTime);
    const actualDurationMinutes = Math.floor(actualDurationMs / 60000);

    // Update session
    session.isActive = false;
    session.actualEndTime = now;
    session.actualDuration = actualDurationMinutes;
    await session.save();

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/check/:userId/:domain', async (req, res) => {
  try {
    const { userId, domain } = req.params;
    const now = new Date();

    console.log('Checking if blocked:', { userId, domain });

    // Find active session
    const session = await FocusSession.findOne({
      userId,
      isActive: true,
      endTime: { $gt: now }
    });

    if (!session) {
      console.log('No active session found');
      return res.json({ blocked: false });
    }

    // Check if domain matches any blocked domain (handle www. prefix)
    const cleanDomain = domain.replace(/^www\./, '');
    const isBlocked = session.blockedDomains.some(blocked => {
      const cleanBlocked = blocked.replace(/^www\./, '');
      return cleanDomain === cleanBlocked || cleanDomain.endsWith('.' + cleanBlocked);
    });

    console.log('Domain check result:', { domain, cleanDomain, blockedDomains: session.blockedDomains, isBlocked });
    res.json({ blocked: isBlocked, session: isBlocked ? session : null });
  } catch (error) {
    console.error('Error checking domain:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get focus mode statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();

    // Get all sessions for this user
    const allSessions = await FocusSession.find({ userId });

    // Calculate stats
    const totalSessions = allSessions.length;
    const completedSessions = allSessions.filter(s => !s.isActive && new Date(s.endTime) <= now).length;
    const activeSessions = allSessions.filter(s => s.isActive && new Date(s.endTime) > now).length;

    // Calculate total minutes focused (use actual duration if ended early)
    const totalMinutesFocused = allSessions.reduce((sum, s) => {
      if (s.isActive) return sum; // Don't count active sessions

      // If session was ended early, use actualDuration
      // If session completed naturally, use planned duration
      const endTime = new Date(s.endTime);
      const actualEndTime = s.actualEndTime ? new Date(s.actualEndTime) : null;

      if (actualEndTime && actualEndTime < endTime) {
        // Ended early - use actual duration
        return sum + (s.actualDuration || 0);
      } else {
        // Completed naturally - use planned duration
        return sum + s.duration;
      }
    }, 0);

    // Get most blocked domains
    const domainCounts = {};
    allSessions.forEach(session => {
      session.blockedDomains.forEach(domain => {
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      });
    });

    const topBlockedSites = Object.entries(domainCounts)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get latest 3 sessions with details
    const recentSessions = allSessions
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, 3)
      .map(s => {
        const endTime = new Date(s.endTime);
        const actualEndTime = s.actualEndTime ? new Date(s.actualEndTime) : null;
        const wasEndedEarly = actualEndTime && actualEndTime < endTime;

        return {
          id: s._id,
          startTime: s.startTime,
          endTime: s.endTime,
          actualEndTime: s.actualEndTime,
          plannedDuration: s.duration,
          actualDuration: wasEndedEarly ? s.actualDuration : s.duration,
          blockedSites: s.blockedDomains,
          isActive: s.isActive,
          wasCompleted: !s.isActive && !wasEndedEarly,
          wasEndedEarly: wasEndedEarly
        };
      });

    res.json({
      totalSessions,
      completedSessions,
      activeSessions,
      totalMinutesFocused,
      topBlockedSites,
      recentSessions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
