// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { sendOTP, verifyOTP, generateToken } = require("./utils");
const {
  saveUserDetails,
  getUserDetails,
  updateUserDetails,
} = require("./userController");
const { authenticateUser } = require("./authMiddleware"); // Add this line
const User = require("./user");
const otpStore = require("./otpStore");
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/GupChup", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const handleRequest = async (req, res, handler) => {
  try {
    const result = await handler(req.body, req.params);
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

app.post("/api/send-otp", async (req, res) => {
  console.log("OTP sending to the email");
  const { email } = req.body;

  try {
    const otp = await sendOTP(email);
    res.json({ success: true, otp });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Error sending email" });
  }
});

app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore[email];

  if (verifyOTP(storedOtp, otp)) {
    delete otpStore[email];
    const token = generateToken(email);
    try {
      const details = await saveUserDetails({ email: email });
      res
        .status(200)
        .json({
          success: true,
          token,
          email: details.email,
          user_id: details.user_id,
        });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to save user details." });
    }
  } else {
    res.json({ success: false, error: "Invalid OTP." });
  }
});

app.post("/api/save-user-details", (req, res) => {
  handleRequest(req, res, saveUserDetails);
});
app.get("/api/get-user/:user_id",
//  authenticateUser, 
 async (req, res) => {
  try {
    console.log("User authenticated:", req.user); // Assuming `authenticateUser` sets `req.user` with user information
    console.log("Requested user ID:", req.params.user_id);
    const userDetails = await getUserDetails(req.params.user_id);
    console.log("User details:", userDetails);
    if (userDetails.success) {
      res.json(userDetails);
    } else {
      res.status(404).json(userDetails);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


app.put("/api/update-user/:user_id", async (req, res) => {
  try {
    const { name, email, phone, age, address } = req.body;
    const { user_id } = req.params;

    // Update user details in the database
    const updatedUser = await User.findOneAndUpdate(
      { user_id },
      { name, email, phoneNumber: phone, age, address },
      { new: true }
    );

    // Check if user was found and updated
    if (updatedUser) {
      res.json({ success: true, user: updatedUser });
    } else {
      // If user is not found, return 404 status
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// ... (same as before)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
