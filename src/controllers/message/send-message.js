const { dbMessage } = require("../../models/message");

const sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message, image } = req.body;
    const newMessage = new dbMessage({
      sender_id,
      receiver_id,
      message,
      image,
    });

    // Save the message to the database
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = { sendMessage };
