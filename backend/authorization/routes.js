const express = require('express');
const passport = require('passport');
const controller = require('./controller.js');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.js');
const jwt = require('jsonwebtoken');  // added for CV upload token check

const router = express.Router();

// using multer for file upload handling.
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// auth
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);

// google auth
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    }),
);

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
        const token = req.user.token;
        res.redirect(`${process.env.CLIENT_URL}/home.html?token=${token}`);
    },
);

// profile routes (keep original middleware)
router.get('/profile', isAuthenticated, controller.getProfile);
router.patch('/profile', isAuthenticated, controller.editProfile);
router.put('/profile', isAuthenticated, controller.editProfile);

// users (keep original middleware)
router.get('/', isAuthenticated, isAdmin, controller.getUsers);
router.get('/:id', controller.getUserById);
router.put('/:id', isAuthenticated, isAdmin, controller.updateUser);
router.delete('/:id', isAuthenticated, isAdmin, controller.deleteUser);

// CV upload route – fixed to accept Authorization header 
const cvAuth = (req, res, next) => {
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

router.post('/upload-cv', cvAuth, upload.single('cv'), controller.uploadCV);

module.exports = router;