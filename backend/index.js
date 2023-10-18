require('dotenv').config()
const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const passportSetup = require("./passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const db = require("./db.ts");
const CalcLogic = require('./CalcLogic');
const app = express();



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).json({ message: "Please log in to continue" });
}

app.post('/calculate', async (req, res) => {
  const { studentUsername, course, score } = req.body;
  await CalcLogic.handleGradeCalculation(studentUsername, course, score);
  res.json({ message: 'Grade calculated!' });
});

app.post('/saveGrade', ensureAuthenticated, async (req, res) => {
  try {
    const { studentUsername, course } = req.body;

    const students = await getCollection('students');
    const result = await students.updateOne(
      { email: studentUsername }, // Assuming the username is the email
      { $push: { courses: course } }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: 'Grade saved successfully!' });
    } else {
      res.json({ message: 'Failed to save grade!' });
    }
  } catch (error) {
    console.error('Error saving grade:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





app.get('/currentUser', ensureAuthenticated, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not Authenticated" });
  }

  res.json({ username: req.user.username });
});


app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [ process.env.CLIENT_URL, process.env.BACKEND_API_URL ],
    methods: "GET,POST,PUT,DELETE, FETCH",
    credentials: true,
  })
);

app.use("/auth", authRoute);

app.listen("5000", () => {
  console.log("Server is running!");
});
