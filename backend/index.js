require('dotenv').config();
const cookieSession = require('cookie-session');
const express = require('express');
const cors = require('cors');
const passportSetup = require('./passport');
const passport = require('passport');
const authRoute = require('./routes/auth');
const db = require('./db.js');
const CalcLogic = require('./CalcLogic');
const app = express();

// CORS Middleware
const corsOptions = {
  origin: [process.env.CLIENT_URL, process.env.BACKEND_API_URL],  // Ensure these values are set correctly in .env
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Cookie Session Middleware
app.use(cookieSession({
  name: 'session',
  keys: ['lama'],
  maxAge: 24 * 60 * 60 * 100
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Route to handle calculation
app.post('/calculate', async (req, res) => {
  const { studentUsername, course, score } = req.body;
  await CalcLogic.handleGradeCalculation(studentUsername, course, score);
  res.json({ message: 'Grade calculated and saved!' });
});

// Authentication Routes
app.use('/auth', authRoute);

// Server Listen
app.listen('5000', () => {
  console.log('Server is running!');
});
