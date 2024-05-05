const UserSchema = require("../../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../../helper/token");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const data = {
          user_id: user.user_id,
          email: user.email,
          user_type: user.user_type,
        };
        const token = generateToken(data);
        if (!token) {
          return res.status(500).json({ error: "Failed to generate token" });
        }
        return res.status(200).json({
          token,
          status: true,
          user_id: user.user_id,
          email: user?.email,
          user_type: user?.user_type,
        });
      } else {
        return res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      return res.status(401).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { login };
