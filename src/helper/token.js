const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  try {
    if (!token.startsWith("Bearer ")) {
      throw new Error("Invalid token format");
    }
    const tokenWithoutBearer = token.slice(7);

    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    console.log(error)
    return { success: false, error:error.message };
  }
};
const decodeToken = (token) => {
  try {
    if (!token.startsWith("Bearer ")) {
      throw new Error("Invalid token format");
    }
    const tokenWithoutBearer = token.slice(7);

    const decoded = jwt.decode(tokenWithoutBearer);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: "Token decoding failed" };
  }
};

const generateToken = (userData) => {
  
  try {
    const plainUserData = JSON.parse(JSON.stringify(userData));
    const token = jwt.sign(plainUserData, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

module.exports = { verifyToken, decodeToken, generateToken };