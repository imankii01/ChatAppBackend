const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UpdateUserSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  status: {
    type: String,
    default: "signup",
    enum: [
      "signup",
      "registered",
      "pending",
      "hold",
      "active",
      "suspended",
      "deleted",
    ],
  },
  user_type: {
    type: String,
    enum: [
      "master",
      "guest",
      
    ],
  },
  photo: {
    type: String,
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  languagePreference: {
    type: String,
  },
  timezone: {
    type: String,
  },
  country: {
    type: String,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
module.exports = UpdateUserSchema;
