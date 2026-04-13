const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./authorization/User.js');
const jwt = require('jsonwebtoken');
const connectDatabase = require('./database.js');
const opportunitiesRouter = require('./opportunities/routes.js');
const userRoutes = require('./authorization/routes.js');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.API_URL}/api/users/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value });

                if (!user) {
                    user = await User.create({
                        firstName: profile.name.givenName || 'Google',
                        lastName: profile.name.familyName || 'User',
                        email: profile.emails[0].value,
                        googleId: profile.id,
                    });
                }

                const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
                    expiresIn: '24h',
                });

                user.token = token;
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        },
    ),
);

// routes
app.use('/api/users', userRoutes);
app.use('/opportunities', opportunitiesRouter);

// Error handling middleware
app.use((req, res) => {
    res.status(404).json({ error: `${req.method} ${req.url} not found` });
});

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    connectDatabase();
    console.log(`Server running on port ${PORT}`);
});
