const User = require("../models/UserModel");

const auth = async (req, res, next) => {
  try {
    // Get user data from request headers (sent from frontend)
    const userData = req.headers['user-data'];
    
    if (!userData) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = JSON.parse(userData);
    
    // Verify user exists in database
    const existingUser = await User.findById(user._id);
    if (!existingUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // Add user to request object
    req.user = existingUser;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = auth; 