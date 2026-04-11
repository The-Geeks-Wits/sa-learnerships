const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRouter = require('./authorization/routes.js');
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
//app.use(express.static("public"));
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            firstName: profile.name.givenName || "Google",
            lastName: profile.name.familyName || "User",
            email: profile.emails[0].value,
            googleId: profile.id
          });
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "30min" }
        );

        user.token = token;
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// routes
//app.use('/', Routes);
//app.use("/api/users", userRoutes);
app.use('/opportunities', opportunitiesRouter);
app.use('/', authRouter);
//app.use("/api/users", userRoutes);
//app.use("/opportunities", opportunitiesRouter);

app.use((req, res) => {
  res.status(404).json({ error: `${req.method} ${req.url} not found` });
});

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  connectDatabase();
  console.log(`Server running on port ${PORT}`);
});
