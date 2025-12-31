import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import API_URL from '../config/api';
import './Login.css';

function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const body = isLogin
                ? { email: formData.email, password: formData.password }
                : formData;

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            // Store token and user data
            localStorage.setItem('cognify_auth_token', data.token);
            localStorage.setItem('cognify_user_id', data.user.userId);
            localStorage.setItem('cognify_user_email', data.user.email);
            localStorage.setItem('cognify_user_name', data.user.name);

            onLogin(data.user);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <Clock size={48} className="login-icon" />
                    <h1>Cognify</h1>
                    <p>Track your time, boost your focus</p>
                </div>

                <div className="login-tabs">
                    <button
                        className={`login-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => {
                            setIsLogin(true);
                            setError('');
                        }}
                    >
                        Login
                    </button>
                    <button
                        className={`login-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => {
                            setIsLogin(false);
                            setError('');
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
