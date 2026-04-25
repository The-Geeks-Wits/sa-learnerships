const User = require('../authorization/User.js');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = async (req, res, next) => {
    try {
        // Request headers are always provided, so we can skip the check
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Access denied! Missing verification token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found! Please check your token and try again later' });
        }

        const userObj = user.toObject();
        delete userObj.password;
        req.user = userObj;

        next();
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong! Please try again later' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'You are not logged in! Please log in to continue' });
    }

    if (req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Access denied! Missing the required role to perform action' });
    }
    next();
};

exports.isProvider = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'You are not logged in! Please log in to continue' });
    }

    if (req.user.role !== 'provider') {
        return res.status(401).json({ message: 'Access denied! Missing the required role to perform action' });
    }
    next();
};
