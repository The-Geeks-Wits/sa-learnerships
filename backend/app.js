const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./authorization/User.js');
const path = require('path');
const jwt = require('jsonwebtoken');
const connectDatabase = require('./database.js');
const cookieParser = require('cookie-parser');

// Routers imports
const applicationsRouter = require('./applications/routes.js');
const opportunitiesRouter = require('./opportunities/routes.js');
const userRoutes = require('./authorization/routes.js');
const notificationsRouter = require('./notifications/routes.js');

//loading reference data and data router
const dataRoutes = require('./authorization/dataRoutes.js');
const qualifications = require('../data/qualifications.json');
const institutions = require('../data/institutions.json');
const skills = require('../data/skills.json');
const locations = require('../data/locations.json');

//ANALYTICS ROUTES
const analyticsRoutes = require('./analytics/analyticsRoutes.js');

dotenv.config();

const app = express();

//making data available to routes using app
app.locals.qualifications = qualifications;
app.locals.institutions = institutions;
app.locals.skills = skills;
app.locals.locations = locations;

// Middlewares
app.use(cors({ 
    origin: process.env.CLIENT_URL, 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/profile', express.static(path.join(__dirname, 'profile')));

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
                        signupMethod: 'google',
                    });
                }

                const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET, {
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
app.use('/applications', applicationsRouter);
app.use('/notifications', notificationsRouter);
app.use('/api/users/data', dataRoutes);


//ANALYTICS ROUTES
app.use('/api/analytics', analyticsRoutes);

// Health status check route (For confirming that the app is up and running when deployed)
app.use('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});
app.use(express.static(path.join(__dirname, '../')));
// Error handling middleware
app.use((req, res) => {
    res.status(404).json({ error: `${req.method} ${req.url} not found` });
});

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    connectDatabase();
    console.log(`Server running on port ${PORT}`);
});
