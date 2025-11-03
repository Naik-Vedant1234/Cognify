import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Plus, X } from 'lucide-react';
import './FocusMode.css';

const API_URL = 'http://localhost:5000/api';

function FocusMode({ userId }) {
  const [duration, setDuration] = useState(25);
  const [blockedSites, setBlockedSites] = useState([]);
  const [newSite, setNewSite] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    checkActiveSession();
  }, [userId]);

  useEffect(() => {
    if (activeSession && timeRemaining > 0) {
      const timer = setInterval(() => {
        const remaining = Math.floor((new Date(activeSession.endTime) - new Date()) / 1000);
        if (remaining <= 0) {
          setActiveSession(null);
          setTimeRemaining(0);
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeSession, timeRemaining]);

  const checkActiveSession = async () => {
    try {
      const res = await axios.get(`${API_URL}/focus/active/${userId}`);
      if (res.data.active) {
        setActiveSession(res.data.session);
        const remaining = Math.floor((new Date(res.data.session.endTime) - new Date()) / 1000);
        setTimeRemaining(remaining);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const addSite = () => {
    if (newSite && !blockedSites.includes(newSite)) {
      setBlockedSites([...blockedSites, newSite]);
      setNewSite('');
    }
  };

  const removeSite = (site) => {
    setBlockedSites(blockedSites.filter(s => s !== site));
  };

  const startFocusMode = async () => {
    try {
      const res = await axios.post(`${API_URL}/focus/start`, {
        userId,
        blockedDomains: blockedSites,
        duration
      });
      setActiveSession(res.data.session);
      setTimeRemaining(duration * 60);
    } catch (error) {
      console.error('Error starting focus mode:', error);
    }
  };

  const endFocusMode = async () => {
    try {
      await axios.post(`${API_URL}/focus/end/${activeSession._id}`);
      setActiveSession(null);
      setTimeRemaining(0);
    } catch (error) {
      console.error('Error ending focus mode:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="focus-mode">
      <div className="focus-container">
        <div className="focus-header">
          <Target size={48} className="focus-icon" />
          <h2>Focus Mode</h2>
          <p>Block distracting websites and stay productive</p>
        </div>

        {activeSession ? (
          <div className="active-session">
            <div className="timer-display">
              <h3>Focus Session Active</h3>
              <div className="timer">{formatTime(timeRemaining)}</div>
              <p>Stay focused! {activeSession.blockedDomains.length} sites blocked</p>
            </div>
            <button className="btn-danger" onClick={endFocusMode}>
              End Session
            </button>
          </div>
        ) : (
          <>
            <div className="duration-selector">
              <label>Focus Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="240"
              />
              <div className="quick-durations">
                {[15, 25, 45, 60].map(d => (
                  <button key={d} onClick={() => setDuration(d)} className="quick-btn">
                    {d}m
                  </button>
                ))}
              </div>
            </div>

            <div className="blocked-sites-section">
              <label>Websites to Block</label>
              <div className="add-site">
                <input
                  type="text"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSite()}
                  placeholder="e.g., youtube.com"
                />
                <button onClick={addSite} className="btn-add">
                  <Plus size={20} />
                </button>
              </div>

              <div className="sites-list">
                {blockedSites.map(site => (
                  <div key={site} className="site-tag">
                    <span>{site}</span>
                    <button onClick={() => removeSite(site)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn-start"
              onClick={startFocusMode}
              disabled={blockedSites.length === 0}
            >
              Start Focus Session
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default FocusMode;
