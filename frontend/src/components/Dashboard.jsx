import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, Globe } from 'lucide-react';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api';
const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

function Dashboard({ userId }) {
  const [period, setPeriod] = useState('day');
  const [stats, setStats] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

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

      const [statsRes, timelineRes] = await Promise.all([
        axios.get(`${API_URL}/tracking/stats/${userId}?period=${period}`),
        axios.get(`${API_URL}/tracking/timeline/${userId}`)
      ]);

      setStats(statsRes.data.stats);
      setTotalTime(statsRes.data.totalTime);
      setTimeline(timelineRes.data.timeline);
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
