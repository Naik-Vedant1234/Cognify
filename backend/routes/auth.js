import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// ===============================
// SIGNUP
// ===============================
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Generate unique userId
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create user
        const user = new User({
            email,
            password,
            name,
            userId
        });

        await user.save();

        // Generate token
        const token = generateToken(user.userId, user.email);

        res.status(201).json({
            success: true,
            token,
            user: {
                userId: user.userId,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// ===============================
// LOGIN
// ===============================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user.userId, user.email);

        res.json({
            success: true,
            token,
            user: {
                userId: user.userId,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// ===============================
// VERIFY TOKEN
// ===============================
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ userId: decoded.userId });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                userId: user.userId,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

export default router;
