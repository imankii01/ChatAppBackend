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
const { authenticateUser } = require("./authMiddleware");
const { User } = require("./models"); // Import User and Message models
const otpStore = require("./otpStore");
const { v4: uuidv4 } = require("uuid");

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
      res.status(200).json({
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

app.get("/api/get-user/:user_id", async (req, res) => {
  try {
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

// Send message API
// Send message API
const MessageSchema = new mongoose.Schema({
  message: String,
  created_at: { type: Date, default: Date.now },
  time: Date,
  status: String,
  sender_id: String,
  receiver_id: String,
  messageId: String,
});

// Create a mongoose model
const Message = mongoose.model("messages", MessageSchema);

// Route to handle POST requests
app.post("/api/send-messages", async (req, res) => {
  try {
    const { message, timestamp, status, sender_id, receiver_id } = req.body;
    const messageId = uuidv4();

    // Save the message to the database
    const newMessage = await Message.create({
      message: message,
      timestamp: timestamp,
      status: status,
      sender_id: sender_id,
      receiver_id: receiver_id,
      messageId: messageId,
    });

    // Send acknowledgment
    res
      .status(200)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/get-messages/:sender_id/:receiver_id", async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.params;
    console.log(sender_id, receiver_id);
    console.log(req.params);
    // Find messages based on sender and receiver IDs
    const messages = await Message.find({
      sender_id: sender_id,
      receiver_id: receiver_id,
    });

    // Send response
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for getting the list of users
app.get("/api/get-user-list/:user_id", async (req, res) => {
  try {
    console.log("Authenticated user:", req.params.user_id);

    // Get the authenticated user's ID
    const userId = req.params.user_id;

    // Query all users except the authenticated user
    const userList = await User.find(
      { user_id: { $ne: userId } },
      {
        email: 1,
        name: 1,
        phoneNumber: 1,
        user_id: 1,
        profile_photo:
          "https://th.bing.com/th/id/OIP.CAbTaFvo9r1nh2uSZgd5yAHaHa?w=185&h=185&c=7&r=0&o=5&pid=1.7",
      }
    );

    res.status(200).json({ success: true, users: userList });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
