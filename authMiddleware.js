// authMiddleware.js
const jwt = require('jsonwebtoken');

const jwtSecretKey = 'your-secret-key'; // Replace with a secure key

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token missing' });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = { authenticateUser };
