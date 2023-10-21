const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); // For password hashing
const passport = require("passport");
const db = require('./db.js');




const GOOGLE_CLIENT_ID =
  "858240029910-kv2g2850elbu4qi9dlj681gtug8q4bf1.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

GITHUB_CLIENT_ID = "your id";
GITHUB_CLIENT_SECRET = "your id";

FACEBOOK_APP_ID = "your id";
FACEBOOK_APP_SECRET = "your id";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }

  )
);


passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
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
