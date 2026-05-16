const express = require('express');
const router = express.Router();
const controller = require('./analyticsController.js');
const jwt = require('jsonwebtoken');

// Middleware that reads token from cookie (same as cvAuth) OR Authorization header
const verifyToken = (req, res, next) => {
    const token = req.cookies?.jwt || req.headers.authorization;   // cookie first, then header
    if (!token) return res.status(401).json({ message: 'No Token Provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            email: decoded.email,
            userId: decoded.userId || decoded.id,
        };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

router.post('/custom-report', verifyToken, controller.getCustomReport);

router.get('/available-options', (req, res) => {
    res.json({
        dimensions: ['location', 'nqfLevel'],
        metrics: ['shortlistRate', 'totalApplications'],
        filters: ['opportunity', 'status', 'dateFrom', 'dateTo']
    });
});

module.exports = router;