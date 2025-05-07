const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("authMiddleware: Authorization header =", token); // Debug log
  if (!token) {
    console.log("authMiddleware: No token provided");
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("authMiddleware: Decoded token =", decoded); // Debug log
    req.user = decoded;
    next();
  } catch (error) {
    console.error("authMiddleware: Token verification error =", error.message); // Debug log
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

