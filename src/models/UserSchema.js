const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    default: function () {
      return uuidv4();
    },
    required: true,
    unique: true,
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
  created_at: {
    type: Date,
    default: Date.now,
  },
});
const dbUser = mongoose.model("User", UserSchema);
module.exports = dbUser;
