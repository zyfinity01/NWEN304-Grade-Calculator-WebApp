const GoogleStrategy = require("passport-google-oauth20").Strategy;

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); // For password hashing
const passport = require("passport");
const db = require('./db.js');




const GOOGLE_CLIENT_ID =
  "858240029910-kv2g2850elbu4qi9dlj681gtug8q4bf1.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";


passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_API_URL}/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }

  )
);



passport.use(new LocalStrategy(
  function(username, password, done) {
    // You'll define the getUserByUsername function shortly
    getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, {message: 'Unknown User'});
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }));



passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
