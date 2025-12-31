import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FocusMode from './components/FocusMode';
import Login from './components/Login';
import FloatingChatbot from './components/FloatingChatbot';
import { Clock, Target, LogOut } from 'lucide-react';
import API_URL from './config/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('cognify_auth_token');
    const userId = localStorage.getItem('cognify_user_id');
    const userName = localStorage.getItem('cognify_user_name');
    const userEmail = localStorage.getItem('cognify_user_email');

    if (token && userId) {
      // Verify token with backend
      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setUser({ userId, userName, userEmail });
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('cognify_auth_token');
          localStorage.removeItem('cognify_user_id');
          localStorage.removeItem('cognify_user_name');
          localStorage.removeItem('cognify_user_email');
        }
      } catch (error) {
        console.error('Auth verification error:', error);
      }
    }

    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('cognify_auth_token');
    localStorage.removeItem('cognify_user_id');
    localStorage.removeItem('cognify_user_name');
    localStorage.removeItem('cognify_user_email');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        {user ? (
          <>
            <nav className="navbar">
              <div className="nav-brand">
                <Clock className="brand-icon" />
                <h1>Cognify</h1>
              </div>
              <div className="nav-links">
                <Link to="/" className="nav-link">
                  <Clock size={20} />
                  Dashboard
                </Link>
                <Link to="/focus" className="nav-link">
                  <Target size={20} />
                  Focus Mode
                </Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </nav>

            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard userId={user.userId} />} />
                <Route path="/focus" element={<FocusMode userId={user.userId} />} />
                <Route path="/blocked" element={<BlockedPage userId={user.userId} />} />
                <Route path="/login" element={<Navigate to="/" />} />
              </Routes>
            </main>

            <FloatingChatbot userId={user.userId} />
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

function BlockedPage({ userId }) {
  const [timeRemaining, setTimeRemaining] = React.useState('');

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/focus/active/${userId}`);
        const data = await res.json();

        if (data.active && data.session) {
          const endTime = new Date(data.session.endTime);
          const updateTimer = () => {
            const now = new Date();
            const diff = endTime - now;

            if (diff <= 0) {
              setTimeRemaining('Session ended');
              window.location.reload();
            } else {
              const minutes = Math.floor(diff / 60000);
              const seconds = Math.floor((diff % 60000) / 1000);
              setTimeRemaining(`${minutes}m ${seconds}s remaining`);
            }
          };

          updateTimer();
          const interval = setInterval(updateTimer, 1000);
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, [userId]);

  return (
    <div className="blocked-page">
      <div className="blocked-content">
        <Target size={80} className="blocked-icon" />
        <h1>🔒 Focus Mode Active</h1>
        <p>This website is currently blocked. Stay focused on your goals!</p>
        {timeRemaining && <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#667eea', marginTop: '1rem' }}>{timeRemaining}</p>}
        <Link to="/" className="btn-primary" style={{ marginTop: '2rem' }}>Go to Dashboard</Link>
      </div>
    </div>
  );
}

export default App;
