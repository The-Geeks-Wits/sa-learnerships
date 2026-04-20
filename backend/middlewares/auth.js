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
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

//middleware to check if the user is admin or not
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

exports.isProvider = (req, res, next) => {
    if (req.user.role !== 'provider') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};
