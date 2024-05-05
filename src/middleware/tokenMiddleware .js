// tokenMiddleware.js

const { verifyToken } = require("../helper/token");

const tokenMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const { success, data, error } = verifyToken(token);

    if (!success) {
      return res.status(401).json({ error });
    }

    req.userData = data;

    next();
  } catch (error) {
    console.error("Error in token middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = tokenMiddleware;
