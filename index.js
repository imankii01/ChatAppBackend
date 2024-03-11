// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { sendOTP, verifyOTP, generateToken } = require('./utils');
const { saveUserDetails, getUserDetails, updateUserDetails } = require('./userController');
const { authenticateUser } = require('./authMiddleware'); // Add this line
const User = require('./user');
const otpStore = require('./otpStore');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/GupChup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const handleRequest = async (req, res, handler) => {
  try {
    const result = await handler(req.body, req.params);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

app.post('/api/send-otp', async (req, res) => {
  console.log('OTP sending to the email');
  const { email } = req.body;

  try {
    const otp = await sendOTP(email);
    res.json({ success: true, otp });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Error sending email' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore[email];

  if (verifyOTP(storedOtp, otp)) {
    delete otpStore[email];
    const token = generateToken(email);
    res.json({ success: true, token });
  } else {
    res.json({ success: false });
  }
});

app.post('/api/save-user-details', (req, res) => {
  handleRequest(req, res, saveUserDetails);
});

app.get('/api/get-user/:user_id', authenticateUser, (req, res) => {
  handleRequest(req, res, getUserDetails);
});

app.put('/api/update-user/:user_id', authenticateUser, (req, res) => {
  handleRequest(req, res, updateUserDetails);
});

// ... (same as before)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
