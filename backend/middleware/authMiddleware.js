// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user info in req.user if needed
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
