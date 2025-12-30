import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Plus, X, Clock } from 'lucide-react';
import './FocusMode.css';
import API_URL from "../config/api";

// Popular sites mapping (name -> domain)
const POPULAR_SITES = {
  'YouTube': 'youtube.com',
  'Facebook': 'facebook.com',
  'Instagram': 'instagram.com',
  'Twitter': 'twitter.com',
  'TikTok': 'tiktok.com',
  'Reddit': 'reddit.com',
  'Netflix': 'netflix.com',
  'Twitch': 'twitch.tv',
  'Discord': 'discord.com',
  'LinkedIn': 'linkedin.com',
  'Pinterest': 'pinterest.com',
  'Snapchat': 'snapchat.com',
  'WhatsApp': 'web.whatsapp.com',
  'Telegram': 'telegram.org',
  'Amazon': 'amazon.com',
  'eBay': 'ebay.com',
  'Spotify': 'spotify.com',
  'SoundCloud': 'soundcloud.com',
  'Hacker News': 'news.ycombinator.com',
  'Medium': 'medium.com',
  'Quora': 'quora.com',
  'Stack Overflow': 'stackoverflow.com',
  'GitHub': 'github.com',
  'Gmail': 'mail.google.com',
  'Outlook': 'outlook.com'
};

// Reverse mapping (domain -> name)
const DOMAIN_TO_NAME = Object.fromEntries(
  Object.entries(POPULAR_SITES).map(([name, domain]) => [domain, name])
);

function FocusMode({ userId }) {
  const [duration, setDuration] = useState(25);
  const [blockedSites, setBlockedSites] = useState([]);
  const [newSite, setNewSite] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    checkActiveSession();
    loadRecommendations();
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

  const loadRecommendations = async () => {
    try {
      const res = await axios.get(`${API_URL}/focus/stats/${userId}`);
      if (res.data.topBlockedSites && res.data.topBlockedSites.length > 0) {
        // Get top 5 previously blocked sites
        const topSites = res.data.topBlockedSites.slice(0, 5).map(site => site.domain);
        setRecommendations(topSites);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const getSiteName = (domain) => {
    return DOMAIN_TO_NAME[domain] || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
  };

  const handleInputChange = (value) => {
    setNewSite(value);

    if (value.length > 0) {
      // Search in popular sites
      const matches = Object.entries(POPULAR_SITES)
        .filter(([name, domain]) =>
          name.toLowerCase().includes(value.toLowerCase()) ||
          domain.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);

      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (domain) => {
    if (!blockedSites.includes(domain)) {
      setBlockedSites([...blockedSites, domain]);
    }
    setNewSite('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const addSite = () => {
    if (!newSite) return;

    let domain = newSite.trim().toLowerCase();

    // Check if it's a site name (e.g., "YouTube")
    const matchedDomain = POPULAR_SITES[newSite.trim()];
    if (matchedDomain) {
      domain = matchedDomain;
    }
    // If it doesn't have a TLD, try to match it
    else if (!domain.includes('.')) {
      const match = Object.entries(POPULAR_SITES).find(([name]) =>
        name.toLowerCase() === domain
      );
      if (match) {
        domain = match[1];
      } else {
        // Assume .com
        domain = domain + '.com';
      }
    }

    if (!blockedSites.includes(domain)) {
      setBlockedSites([...blockedSites, domain]);
      setNewSite('');
      setSuggestions([]);
      setShowSuggestions(false);
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

              {/* Recommendations from previous sessions */}
              {recommendations.length > 0 && blockedSites.length === 0 && (
                <div className="recommendations">
                  <div className="recommendations-header">
                    <Clock size={16} />
                    <span>Previously blocked:</span>
                  </div>
                  <div className="recommendation-chips">
                    {recommendations.map(domain => (
                      <button
                        key={domain}
                        onClick={() => selectSuggestion(domain)}
                        className="recommendation-chip"
                      >
                        <Plus size={14} />
                        {getSiteName(domain)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="add-site">
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={newSite}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSite()}
                    onFocus={() => newSite && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="e.g., YouTube or youtube.com"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {suggestions.map(([name, domain]) => (
                        <div
                          key={domain}
                          className="suggestion-item"
                          onClick={() => selectSuggestion(domain)}
                        >
                          <span className="suggestion-name">{name}</span>
                          <span className="suggestion-domain">{domain}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={addSite} className="btn-add">
                  <Plus size={20} />
                </button>
              </div>

              <div className="sites-list">
                {blockedSites.map(site => (
                  <div key={site} className="site-tag">
                    <div className="site-info">
                      <span className="site-name">{getSiteName(site)}</span>
                      <span className="site-domain">{site}</span>
                    </div>
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
