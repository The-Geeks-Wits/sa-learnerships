const express = require('express');
const router = express.Router();
const controller = require('./analyticsController.js');
const { isAuthenticated, isProvider } = require('../middlewares/auth.js');
const jwt = require('jsonwebtoken');

// Middleware that reads token from cookie (same as cvAuth) OR Authorization header
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.cookies?.jwt;
        
    if (!token) return res.status(401).json({ error: 'No Token Provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            email: decoded.email,
            userId: decoded.id || decoded.userId,
        };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
};

router.get('/placement-form', (req, res) => {
    res.sendFile(path.join(__dirname, '../opportunities/placement_form.html'));
});
router.post('/custom-report', verifyToken, controller.getCustomReport);
router.post('/placement-success-report', verifyToken, controller.getPlacementSuccessReport);
router.post('/export-placement-report', verifyToken, controller.exportPlacementReport);
router.get('/application-volume',isAuthenticated, controller.getApplicationVolume);

router.get('/available-options', (req, res) => {
    res.json({
        dimensions: ['location', 'nqfLevel'],
        metrics: ['shortlistRate', 'totalApplications'],
        filters: ['opportunity', 'status', 'dateFrom', 'dateTo']
    });
});
router.get('/placement-options', (req, res) => {
    res.json({
        sectors: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Construction', 'Education', 'Hospitality']
    });
});

module.exports = router;