const express = require('express');
const passport = require('passport');
const controller = require('./controller.js');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.js');

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

// google auth
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    }),
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/',
    }),
    (req, res) => {
        const token = req.user.token;
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false, //we have to change it to true in production
            sameSite: 'Lax',
            maxAge: 3600000,
        });

        res.redirect(`${process.env.CLIENT_URL}/home.html`);
    },
);

// profile routes
router.get('/profile', isAuthenticated, controller.getProfile);
router.patch('/profile', isAuthenticated, controller.editProfile);

// users
router.get('/', isAuthenticated, isAdmin, controller.getUsers);
router.get('/:id', controller.getUserById);
router.put('/:id', isAuthenticated, isAdmin, controller.updateUser);
router.delete('/:id', isAuthenticated, isAdmin, controller.deleteUser);

// cv upload route
router.post('/upload-cv', isAuthenticated, upload.single('cv'), controller.uploadCV);

module.exports = router;
