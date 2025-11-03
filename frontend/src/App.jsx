import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FocusMode from './components/FocusMode';
import FloatingChatbot from './components/FloatingChatbot';
import { Clock, Target } from 'lucide-react';
import './App.css';

function App() {
  const [userId, setUserId] = useState(() => {
    let id = localStorage.getItem('cognify_user_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cognify_user_id', id);
    }
    console.log('Dashboard using user ID:', id);
    return id;
  });

  // Try to sync with extension on mount
  useEffect(() => {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
      // We're in a Chrome extension context, try to get the extension's user ID
      try {
        chrome.storage.local.get(['userId'], (result) => {
          if (result.userId && result.userId !== userId) {
            console.log('Syncing with extension user ID:', result.userId);
            localStorage.setItem('cognify_user_id', result.userId);
            setUserId(result.userId);
          }
        });
      } catch (e) {
        console.log('Not in extension context, using localStorage ID');
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
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
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard userId={userId} />} />
            <Route path="/focus" element={<FocusMode userId={userId} />} />
            <Route path="/blocked" element={<BlockedPage />} />
          </Routes>
        </main>

        {/* Floating Chatbot - Available on all pages */}
        <FloatingChatbot userId={userId} />
      </div>
    </BrowserRouter>
  );
}

function BlockedPage() {
  const [timeRemaining, setTimeRemaining] = React.useState('');
  const [userId] = React.useState(() => localStorage.getItem('cognify_user_id'));

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/focus/active/${userId}`);
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
