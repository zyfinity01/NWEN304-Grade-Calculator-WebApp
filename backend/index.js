require('dotenv').config()
const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const passportSetup = require("./passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const db = require("./db.js");
const CalcLogic = require('./CalcLogic');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.BACKEND_API_URL],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).json({ message: "Please log in to continue" });
}

app.post('/calculate', async (req, res) => {
  console.log(req.body);
  //const { studentUsername, course, score } = req.body;
  // if (!studentUsername || !course || !score) {
  //   return res.status(400).json({ message: 'Missing required fields' });
  // }

  //await CalcLogic.handleGradeCalculation(studentUsername, course, score);
  res.json({ message: 'Grade calculated!' });
});

app.post('/saveGrade', ensureAuthenticated, async (req, res) => {
  console.log("test test test --------------------------- test test test");
});

app.get('/currentUser', ensureAuthenticated, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not Authenticated" });
  }

  res.json({ username: req.user.username });
});

app.use("/auth", authRoute);

app.listen("5000", () => {
  console.log("Server is running!");
});
