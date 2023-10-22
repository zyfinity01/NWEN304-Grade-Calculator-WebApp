require('dotenv').config();
const router = require("express").Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');  // Ensure you have the jsonwebtoken package installed.
const db = require('../db.js');


const CLIENT_URL = process.env.CLIENT_URL;

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});



router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  db.registerUser(username, password).then(() => {
    res.json({ success: true, message: "User registered successfully" });
  }).catch(err => {
    res.json({ success: false, message: err.message });
  });
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));


router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  if (req.isAuthenticated()) {
      // User is authenticated, generate JWT token
      const jwtToken = jwt.sign({
          id: req.user.id,
          displayName: req.user.displayName,
      }, `${process.env.JWT_SECRET}`, { expiresIn: '1h' });  // set expiration as needed

      // Determine the domain for the cookie
      let cookieDomain;
      const url = new URL(CLIENT_URL);
      if (url.hostname.endsWith('.gradecalc.live')) {
          cookieDomain = '.gradecalc.live';
      }

      // Set JWT as a cookie
      res.cookie('jwt', jwtToken, {
          httpOnly: true,
          domain: cookieDomain,  // This will be either ".gradecalc.live" or undefined (for localhost)
          // ... other options
      });

      // Redirect to the client URL
      res.redirect(CLIENT_URL);
  } else {
      // Authentication failed
      res.redirect("/login/failed");
  }
});


router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = router