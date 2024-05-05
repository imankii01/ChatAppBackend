var mongoose = require("mongoose");

const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");
const messageServiceSchema = new Schema({
  message_id: {
    type: "String",
    default: function genUUID() {
      return uuidv4();
    },
  },
  sender_id: {
    type: "String",
  },
  receiver_id: {
    type: "String",
  },
  message: {
    type: "String",
  },
  image: {
    type: "String",
  },
  status: { type: "String", enum: ["read", "unread"], default: "unread" },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const dbMessage = mongoose.model("message", messageServiceSchema, "message");

module.exports = { dbMessage };
