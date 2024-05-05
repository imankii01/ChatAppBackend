const bcrypt = require("bcrypt");
const { generateToken } = require("../../helper/token");
const dbUser = require("../../models/UserSchema");

const createNewUser = async (req, res) => {
  try {
    let { first_name, last_name, email, password, user_type } = req.body;
    if (!user_type) {
      user_type = "guest";
    }

    const existingUser = await dbUser.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "User already exists" });
    }

    const securePassword = await bcrypt.hash(password, 10);

    const newUser = new dbUser({
      first_name,
      last_name,
      user_type,
      email,
      password: securePassword,
    });

    const data = await newUser.save();

    const token = generateToken({
      user_id: data?.user_id,
      email: data?.email,
      user_type: data?.user_type,
    });

    if (!token) {
      return res.status(500).json({ error: "Failed to generate token" });
    }

    return res.json({
      token,
      status: true,
      email: data?.email,
      user_id: data?.user_id,
      user_type: data?.user_type,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { createNewUser };
