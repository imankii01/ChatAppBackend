const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const cors = require('cors');
const Joi = require('joi');
const User = require('./user');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// Replace with your email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '21cs34@lingayasvidyapeeth.edu.in',
    pass: '21cs34@aA',
  },
});

// In-memory storage for generated OTPs (replace with a database in a real-world scenario)
const otpStore = {};

// Joi schema for user details validation
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
});

// Secret key for JWT
const jwtSecretKey = 'your-secret-key'; // Replace with a secure key

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/GupChup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware to authenticate requests
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token missing' });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

app.post('/api/send-otp', (req, res) => {
  console.log("otp sending to the email");
  const { email } = req.body;
  const otp = randomstring.generate({ length: 6, charset: 'numeric' });

  otpStore[email] = otp;

  const mailOptions = {
    from: '21cs34@lingayasvidyapeeth.edu.in',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP for email verification is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Retrieve stored OTP for the email
  const storedOtp = otpStore[email];

  if (storedOtp && storedOtp === otp) {
    // OTP is valid
    delete otpStore[email]; // Remove the used OTP

    // Generate JWT token
    const token = jwt.sign({ email }, jwtSecretKey, { expiresIn: '1h' });

    res.json({ success: true, token });
  } else {
    // Invalid OTP
    res.json({ success: false });
  }
});

app.post('/api/save-user-details', async (req, res) => {
  try {
    // Validate request body against the Mongoose schema
    const user = new User(req.body);
    await user.validate();

    // Save user details to the database
    const savedUser = await user.save();

    res.json({ success: true, userId: savedUser._id });
  } catch (error) {
    console.error('Error saving user details:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/get-user/:userId', authenticateUser, async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user details from the database
    const user = await User.findById(userId);

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.put('/api/update-user/:userId', authenticateUser, async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate request body against the Mongoose schema
    const user = new User(req.body);
    await user.validate();

    // Update user details in the database
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

    if (updatedUser) {
      res.json({ success: true, userId: updatedUser._id });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Example protected route
app.get('/api/user-details', authenticateUser, async (req, res) => {
  // Return user details
  const { email } = req.user;

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
