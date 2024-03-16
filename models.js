const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  user_id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  age: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
});

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
});

const connectionListSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  user_id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
const ConnectionList = mongoose.model("ConnectionList", connectionListSchema); // Corrected model name
const Message = mongoose.model("Message", messageSchema);

module.exports = { User, Message, ConnectionList };
