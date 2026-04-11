const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Routes = require('./authorization/routes');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./common/models/User');
const jwt = require('jsonwebtoken');
const connectDatabase = require('./database.js');
const opportunitiesRouter = require('./opportunities/routes.js');
//const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// serve static files (if you use frontend in /public)
//app.use(express.static("public"));
app.use(express.static(__dirname + "/.."));  // Serve HTML files from project root

// middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
},async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
            const firstName = profile.name.givenName || profile.displayName?.split(' ')[0] || 'Google';
            const lastName = profile.name.familyName || profile.displayName?.split(' ')[1] || 'User';
            if (!firstName || firstName === '') {
                throw new Error('First name is required but could not be extracted');
            }
            user = await User.create({
                firstName: firstName,
                lastName: lastName,
                email: profile.emails[0].value,
                googleId: profile.id,
                password: null
            });
        
        }
        const token = jwt.sign({
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {expiresIn: "30min"});
        user.token = token;
        return done(null, user);
    }  
        
    catch (error) {
        console.error('Google auth error:', error);
        return done(error, null);
    }
}));
passport.serializeUser((user,done) =>done(null, user));
passport.deserializeUser(async (id, done)=>{
    const user = await User.findById(id);
    done(null,user);
});

// routes
app.use('/', Routes);
//app.use("/api/users", userRoutes);
app.use('/opportunities', opportunitiesRouter);

// 404 Error handling middleware
app.use((req, res, next) => {
    const url = req.url;
    const httpMethod = req.method;
    res.status(404).json({ error: httpMethod + ' ' + url + ' not found' });
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    connectDatabase();
    console.log(`Server running on port ${PORT}`);
});
