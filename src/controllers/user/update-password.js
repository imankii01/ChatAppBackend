const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../../helper/token");
const { passwordResetStore } = require("../../helper/common");

const dbUserDetails = mongoose.connection.collection("users");

const updatePassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token or password is missing" });
    }
    const tokenWithoutBearer = token.slice(7);

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.success) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await dbUserDetails.findOne({
      email: decodedToken.data.email,
      user_id: decodedToken.data.user_id,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetRequest = passwordResetStore[decodedToken.data.email];
    if (
      !resetRequest &&
      resetRequest !== tokenWithoutBearer &&
      resetRequest.expiration < Date.now()
    ) {
      return res.status(400).json({
        error: "Reset password request not found or expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbUserDetails.updateOne(
      { email: decodedToken.data.email },
      { $set: { password: hashedPassword } }
    );

    delete passwordResetStore[decodedToken.data.email];

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  updatePassword,
};
