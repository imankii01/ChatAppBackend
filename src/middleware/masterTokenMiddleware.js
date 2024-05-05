// tokenMiddleware.js
const { verifyToken } = require("../helper/token");
const dbUser = require("../models/UserSchema");

const masterTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const { success, data, error } = verifyToken(token);

    if (!success) {
      return res.status(401).json({ error });
    }

    const { user_id, user_type } = data;

    const userData = await dbUser.findOne({ user_id });
    if (!userData) {
      return res.status(401).json({ error: "User Data not found or exist" });
    }
    if (userData?.user_type !== user_type && user_type !== "master_administrator") {
      return res.status(401).json({ error: "Permission denied!" });
    }

    next();
  } catch (error) {
    console.error("Error in token middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = masterTokenMiddleware;
