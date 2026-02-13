import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

// -----------------------------
// Verify JWT Token Middleware
// -----------------------------
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user data to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
      error: error.message,
    });
  }
};

// -----------------------------
// Role Check Middleware
// -----------------------------
export const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (req.user.role === "superadmin") {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: SuperAdmin only" });
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: Admin only" });
};

export const isAdminOrSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: Admin/SuperAdmin only" });
};
