const express = require('express');
const passport = require('passport');
const { verifyToken, isAdmin } = require('../middlewares/auth.js');
const controller = require('./controller.js');

const router = express.Router();

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
            maxAge: 3600000,
        });
        res.redirect(`${process.env.CLIENT_URL}/index.html`);
    },
);

router.get('/profile', isAuthenticated, (req, res) => {
    res.json({ user: req.user });
});

// users
router.get('/', verifyToken,isAdmin, controller.getUsers);
router.get('/:id', controller.getUserById);
router.put('/:id', verifyToken,isAdmin, controller.updateUser);
router.delete('/:id', verifyToken,isAdmin, controller.deleteUser);

module.exports = router;
