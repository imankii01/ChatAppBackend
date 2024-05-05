const mongoose = require("mongoose");
const { verifyToken } = require("../../helper/token");

const dbUser = mongoose.connection.collection("users");
const dbMessage = mongoose.connection.collection("message");

const getMessage = async (req, res) => {
  try {
    const { sender_id } = req.query;

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(200).send({
        error: "Token missing",
      });
    }
    const verification = verifyToken(authHeader);
    const { data, success, error } = verification;
    if (!success) {
      return res.status(200).send({
        error: error,
      });
    }
    const receiver_id = data?.user_id;
    const messages = await dbMessage
      .find({
        $or: [
          { sender_id: receiver_id, receiver_id: sender_id },
          { sender_id: sender_id, receiver_id: receiver_id },
        ],
      })
      // .sort({ created_at: 1 })
      .toArray();

    const userDetails = await getUserDetails([sender_id, receiver_id]);

    const mergedMessages = messages.map((message) => {
      const sender = userDetails.find(
        (user) => user.user_id === message.sender_id
      );
      const receiver = userDetails.find(
        (user) => user.user_id === message.receiver_id
      );

      return {
        ...message,
        sender: {
          first_name: sender ? sender.first_name : "",
          last_name: sender ? sender.last_name : "",
          photo: sender ? sender.photo : "",
          user_id: sender ? sender.user_id : "",
        },
        receiver: {
          first_name: receiver ? receiver.first_name : "",
          last_name: receiver ? receiver.last_name : "",
          photo: receiver ? receiver.photo : "",
          user_id: receiver ? receiver.user_id : "",
        },
      };
    });

    return res.status(200).send(mergedMessages);
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};

const getUserDetails = async (userIds) => {
  try {
    const result = await dbUser.find({ user_id: { $in: userIds } }).toArray();
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getMessage,
};
