const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter } = require("../../helper/transporter");
const { generateToken } = require("../../helper/token");
const { passwordResetStore } = require("../../helper/common");

const dbUserDetails = mongoose.connection.collection("users");

const forgetPasswordLinkGenerator = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Email is missing");
    }

    const userData = await dbUserDetails.findOne({ email });

    if (userData) {
      if (passwordResetStore[email]) {
        return res.status(400).send("Reset password request already exists");
      }

      const token = generateToken({
        email: userData?.email,
        user_id: userData?.user_id,
      });

      const resetPasswordLink = `http://localhost:3000/reset-password?token=${token}`;

      await transporter.sendMail({
        from: '"Your Application" <noreply@example.com>',
        to: email,
        subject: "Reset Password",
        text: `Please click the link to reset your password: ${resetPasswordLink}`,
        html: `<p>Please click the link to reset your password: <a href="${resetPasswordLink}">${resetPasswordLink}</a></p>`,
      });

      passwordResetStore[email] = {
        token,
        expiration: Date.now() + 120000, // 1 minute
      };

      setTimeout(() => {
        delete passwordResetStore[email];
        console.log("delet email");
      }, 120000);

      return res.status(200).send({
        message: "Reset password email sent successfully",
      });
    } else {
      return res.status(404).send({
        error: "User details not found",
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

module.exports = {
  forgetPasswordLinkGenerator,
};
