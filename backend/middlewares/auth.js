const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    next();
};

exports.verifyToken = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};

//middleware to check if the user is admin or not
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    next();
};

//middleware to check if the user is provider or not
exports.isProvider = (req, res, next) => {
    if (req.user.role !== 'provider') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};
