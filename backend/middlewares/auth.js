const User = require('../authorization/User.js');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies.jwt; // fallback for local dev

        if (!token) {
            return res.status(401).json({ error: 'Access denied! Missing verification token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found! Please check your token and try again later' });
        }
        if (user.status === 'disabled') {
            return res.status(401).json({ error: 'Your account has been disabled. Please contact an administrator.' });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: 'Invalid or malformed token' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'You are not logged in! Please log in to continue' });
    }
    if (req.user.role !== 'admin') {
        return res.status(401).json({ error: 'Access denied! Missing the required role to perform action' });
    }
    next();
};

exports.isProvider = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'You are not logged in! Please log in to continue' });
    }
    if (req.user.role !== 'provider') {
        return res.status(401).json({ error: 'Access denied! Missing the required role to perform action' });
    }
    next();
};