const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");


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
      const students = db.collection('students');

      students.findOne({ oauthID: profile.id }, function (err, user) {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (user) {
          return done(null, user);
        } else {
          students.insertOne({
            oauthID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            courses: []  // Initially empty
          }, function (err, newUser) {
            if (err) {
              console.log(err);
              return done(err);
            }
            return done(null, newUser);
          });
        }
      });
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

passport.serializeUser(function (user, done) {
  done(null, user.oauthID);
});


passport.deserializeUser(function (oauthID, done) {
  const students = db.collection('students');
  students.findOne({ oauthID: oauthID }, function (err, user) {
    done(err, user);
  });
});

