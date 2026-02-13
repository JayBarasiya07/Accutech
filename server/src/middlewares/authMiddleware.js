import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ===============================
// VERIFY TOKEN
// ===============================
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Token check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Safe userId fetch
    const userId = decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token: User ID missing" });
    }

    // Find user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

// ===============================
// SUPERADMIN ONLY
// ===============================
export const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (req.user.role === "superadmin") return next();

  return res.status(403).json({ message: "Only SuperAdmin allowed" });
};

// ===============================
// ADMIN ONLY
// ===============================
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (req.user.role === "admin") return next();

  return res.status(403).json({ message: "Admin only access" });
};

// ===============================
// ADMIN OR SUPERADMIN
// ===============================
export const isAdminOrSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }

  return res.status(403).json({ message: "Access denied" });
};
