import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Target, BarChart3, Download, Chrome, CheckCircle, Zap, Shield, TrendingUp, LogIn, UserPlus } from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();

    const handleDownload = () => {
        // Check if user is logged in
        const token = localStorage.getItem('cognify_auth_token');
        if (!token) {
            alert('Please login or sign up to download the extension');
            navigate('/login');
            return;
        }

        // User is logged in, allow download
        const link = document.createElement('a');
        link.href = '/cognify-extension.zip';
        link.download = 'cognify-extension.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="landing-page">
            {/* Navigation Bar */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="nav-brand">
                        <Clock size={28} />
                        <span>Cognify</span>
                    </div>
                    <div className="nav-actions">
                        <button className="nav-btn login-btn" onClick={() => navigate('/login')}>
                            <LogIn size={18} />
                            Login
                        </button>
                        <button className="nav-btn signup-btn" onClick={() => navigate('/login')}>
                            <UserPlus size={18} />
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Zap size={16} />
                        <span>Free & Open Source</span>
                    </div>
                    <h1 className="hero-title">
                        Track Your Time.<br />
                        Boost Your Focus.
                    </h1>
                    <p className="hero-subtitle">
                        Cognify automatically tracks how you spend time online and helps you stay focused with powerful blocking tools. Take control of your productivity today.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary-large" onClick={() => navigate('/login')}>
                            Get Started Free
                        </button>
                        <button className="btn-secondary-large" onClick={handleDownload}>
                            <Download size={20} />
                            Download Extension
                        </button>
                    </div>
                    <p className="hero-note">
                        <Chrome size={16} />
                        Works on Chrome, Brave, Edge & all Chromium browsers
                    </p>
                </div>
                <div className="hero-visual">
                    <div className="floating-card card-1">
                        <Clock size={24} className="card-icon" />
                        <div>
                            <div className="card-label">Today's Time</div>
                            <div className="card-value">4h 32m</div>
                        </div>
                    </div>
                    <div className="floating-card card-2">
                        <Target size={24} className="card-icon" />
                        <div>
                            <div className="card-label">Focus Sessions</div>
                            <div className="card-value">12 completed</div>
                        </div>
                    </div>
                    <div className="floating-card card-3">
                        <BarChart3 size={24} className="card-icon" />
                        <div>
                            <div className="card-label">Sites Tracked</div>
                            <div className="card-value">47 sites</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Everything You Need to Stay Productive</h2>
                    <p>Powerful features to help you understand and improve how you spend your time</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Clock size={32} />
                        </div>
                        <h3>Automatic Time Tracking</h3>
                        <p>Tracks every website you visit automatically. Only counts active time when the tab is visible - no manual timers needed.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Target size={32} />
                        </div>
                        <h3>Focus Mode</h3>
                        <p>Block distracting websites for a set duration. Stay focused on your work with customizable blocking lists.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <BarChart3 size={32} />
                        </div>
                        <h3>Detailed Analytics</h3>
                        <p>View comprehensive statistics on your personal dashboard. See daily, weekly, and monthly breakdowns of your time.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <TrendingUp size={32} />
                        </div>
                        <h3>Productivity Insights</h3>
                        <p>Track focus sessions, see your most visited sites, and identify time-wasting patterns to improve productivity.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Shield size={32} />
                        </div>
                        <h3>Privacy First</h3>
                        <p>Your data is private and secure. No selling data to third parties. You own your information completely.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Chrome size={32} />
                        </div>
                        <h3>Cross-Browser Sync</h3>
                        <p>Use the same account across Chrome, Brave, Edge, and other browsers. Your data syncs automatically.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>Get started in minutes with these simple steps</p>
                </div>
                <div className="steps-timeline">
                    <div className="step-item">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>Download Extension</h3>
                            <p>Download the Cognify extension ZIP file and extract it to a folder on your computer.</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>Install in Browser</h3>
                            <p>Go to chrome://extensions, enable Developer Mode, and load the unpacked extension folder.</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Create Account</h3>
                            <p>Sign up for a free account to sync your data across devices and access your dashboard.</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>Start Tracking</h3>
                            <p>That's it! Browse normally and Cognify will automatically track your time and provide insights.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Installation Guide Section */}
            <section className="installation-section">
                <div className="installation-content">
                    <div className="installation-text">
                        <h2>Easy Installation</h2>
                        <p className="installation-intro">
                            Since Cognify is free and open-source, you can install it manually without any Chrome Web Store fees. Follow these quick steps:
                        </p>
                        <div className="installation-steps">
                            <div className="install-step">
                                <CheckCircle size={20} className="check-icon" />
                                <div>
                                    <strong>Download & Extract</strong>
                                    <p>Download the ZIP file and extract it to a permanent folder</p>
                                </div>
                            </div>
                            <div className="install-step">
                                <CheckCircle size={20} className="check-icon" />
                                <div>
                                    <strong>Enable Developer Mode</strong>
                                    <p>Open chrome://extensions and turn on Developer Mode</p>
                                </div>
                            </div>
                            <div className="install-step">
                                <CheckCircle size={20} className="check-icon" />
                                <div>
                                    <strong>Load Extension</strong>
                                    <p>Click "Load unpacked" and select the extracted folder</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary-large" onClick={handleDownload}>
                            <Download size={20} />
                            Download Extension Now
                        </button>
                        <p className="installation-help">
                            Need detailed instructions? <a href="/extension">View full installation guide →</a>
                        </p>
                    </div>
                    <div className="installation-visual">
                        <div className="browser-mockup">
                            <div className="browser-header">
                                <div className="browser-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div className="browser-url">chrome://extensions</div>
                            </div>
                            <div className="browser-content">
                                <div className="extension-card-mock">
                                    <div className="ext-icon">
                                        <Clock size={32} />
                                    </div>
                                    <div className="ext-info">
                                        <div className="ext-name">Cognify - Time Tracker</div>
                                        <div className="ext-version">Version 1.0.0</div>
                                        <div className="ext-status">✓ Enabled</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">100%</div>
                        <div className="stat-label">Free Forever</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">0</div>
                        <div className="stat-label">Data Sold</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">5+</div>
                        <div className="stat-label">Browsers Supported</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">∞</div>
                        <div className="stat-label">Sites Tracked</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Take Control of Your Time?</h2>
                    <p>Join users who are already tracking their time and boosting their productivity with Cognify.</p>
                    <div className="cta-buttons">
                        <button className="btn-primary-large" onClick={() => navigate('/login')}>
                            Create Free Account
                        </button>
                        <button className="btn-secondary-large" onClick={handleDownload}>
                            <Download size={20} />
                            Download Extension
                        </button>
                    </div>
                    <p className="cta-note">No credit card required • Free forever • 2 minute setup</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Clock size={32} />
                        <h3>Cognify</h3>
                        <p>Track your time. Boost your focus.</p>
                    </div>
                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Product</h4>
                            <a href="/extension">Download Extension</a>
                            <a href="/login">Dashboard</a>
                            <a href="/login">Sign Up</a>
                        </div>
                        <div className="footer-column">
                            <h4>Resources</h4>
                            <a href="/extension">Installation Guide</a>
                            <a href="/extension">Troubleshooting</a>
                            <a href="/extension">FAQ</a>
                        </div>
                        <div className="footer-column">
                            <h4>About</h4>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Cognify. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
