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
    const session = await FocusSession.findByIdAndUpdate(
      sessionId,
      { isActive: false },
      { new: true }
    );
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

export default router;
