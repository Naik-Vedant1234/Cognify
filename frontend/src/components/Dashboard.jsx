import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, Globe, Target, Shield } from 'lucide-react';
import './Dashboard.css';
import API_URL from "../config/api";

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

function Dashboard({ userId }) {
  const [period, setPeriod] = useState('day');
  const [stats, setStats] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [focusStats, setFocusStats] = useState(null);

  useEffect(() => {
    // Initial load with loading spinner
    fetchData(true);

    // Auto-refresh every 30 seconds WITHOUT loading spinner
    const interval = setInterval(() => {
      fetchData(false); // Silent background update
    }, 30000);

    return () => clearInterval(interval);
  }, [period, userId]);

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const [statsRes, timelineRes, focusRes] = await Promise.all([
        axios.get(`${API_URL}/tracking/stats/${userId}?period=${period}`),
        axios.get(`${API_URL}/tracking/timeline/${userId}`),
        axios.get(`${API_URL}/focus/stats/${userId}`)
      ]);

      setStats(statsRes.data.stats);
      setTotalTime(statsRes.data.totalTime);
      setTimeline(timelineRes.data.timeline);
      setFocusStats(focusRes.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Your Activity Dashboard</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refreshes every 30s
          </p>
        </div>
        <div className="period-selector">
          {['hour', 'day', 'month', 'year'].map(p => (
            <button
              key={p}
              className={`period-btn ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading your data...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <Clock className="stat-icon" />
              <div className="stat-content">
                <h3>Total Time</h3>
                <p className="stat-value">{formatTime(totalTime)}</p>
              </div>
            </div>
            <div className="stat-card">
              <Globe className="stat-icon" />
              <div className="stat-content">
                <h3>Websites Visited</h3>
                <p className="stat-value">{stats.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <TrendingUp className="stat-icon" />
              <div className="stat-content">
                <h3>Most Visited</h3>
                <p className="stat-value">{stats[0]?.domain || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Focus Mode Stats */}
          {focusStats && focusStats.totalSessions > 0 && (
            <div className="focus-stats-section">
              <h2 className="section-title">
                <Target size={24} />
                Focus Mode Statistics
              </h2>
              <div className="focus-stats-grid">
                <div className="focus-stat-card">
                  <Target className="focus-stat-icon" />
                  <div className="focus-stat-content">
                    <h4>Total Sessions</h4>
                    <p className="focus-stat-value">{focusStats.totalSessions}</p>
                  </div>
                </div>
                <div className="focus-stat-card">
                  <Shield className="focus-stat-icon" />
                  <div className="focus-stat-content">
                    <h4>Completed</h4>
                    <p className="focus-stat-value">{focusStats.completedSessions}</p>
                  </div>
                </div>
                <div className="focus-stat-card">
                  <Clock className="focus-stat-icon" />
                  <div className="focus-stat-content">
                    <h4>Time Focused</h4>
                    <p className="focus-stat-value">{formatTime(focusStats.totalMinutesFocused * 60)}</p>
                  </div>
                </div>
              </div>

              {/* Most Blocked Sites */}
              {focusStats.topBlockedSites && focusStats.topBlockedSites.length > 0 && (
                <div className="blocked-sites-section">
                  <h3>Most Blocked Sites</h3>
                  <div className="blocked-sites-list">
                    {focusStats.topBlockedSites.map((site, index) => (
                      <div key={site.domain} className="blocked-site-item">
                        <div className="blocked-site-rank">#{index + 1}</div>
                        <div className="blocked-site-info">
                          <span className="blocked-site-domain">{site.domain}</span>
                          <span className="blocked-site-count">{site.count} times blocked</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Focus Sessions */}
              {focusStats.recentSessions && focusStats.recentSessions.length > 0 && (
                <div className="recent-sessions-section">
                  <h3>Recent Focus Sessions</h3>
                  <div className="recent-sessions-list">
                    {focusStats.recentSessions.map((session, index) => (
                      <div key={session.id} className="session-card">
                        <div className="session-header">
                          <div className="session-number">Session #{focusStats.totalSessions - index}</div>
                          <div className={`session-status ${session.isActive ? 'active' : session.wasCompleted ? 'completed' : 'ended-early'}`}>
                            {session.isActive ? '🟢 Active' : session.wasCompleted ? '✅ Completed' : '⏹️ Ended Early'}
                          </div>
                        </div>
                        <div className="session-time">
                          <span className="session-date">
                            {new Date(session.startTime).toLocaleDateString()} at {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="session-duration">
                            {session.wasEndedEarly ? (
                              <>
                                <span className="actual-duration">{session.actualDuration} min</span>
                                <span className="planned-duration"> / {session.plannedDuration} min planned</span>
                              </>
                            ) : (
                              <span>{session.actualDuration} min</span>
                            )}
                          </span>
                        </div>
                        <div className="session-sites">
                          <span className="sites-label">Blocked:</span>
                          <div className="sites-tags">
                            {session.blockedSites.map(site => (
                              <span key={site} className="site-badge">{site}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Top Websites</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="domain" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatTime(value)} />
                  <Bar dataKey="duration" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Time Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.slice(0, 6)}
                    dataKey="duration"
                    nameKey="domain"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => entry.domain}
                  >
                    {stats.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatTime(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card full-width">
              <h3>Hourly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatTime(value)} />
                  <Line type="monotone" dataKey="duration" stroke="#667eea" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="website-list">
            <h3>Detailed Breakdown</h3>
            {stats.map((site, index) => (
              <div key={index} className="website-item">
                <div className="website-info">
                  {site.favicon && <img src={site.favicon} alt="" className="favicon" />}
                  <span className="domain">{site.domain}</span>
                </div>
                <div className="website-stats">
                  <span className="visits">{site.visits} visits</span>
                  <span className="duration">{formatTime(site.duration)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
