import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdminOrSuper = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin only access" });
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Only SuperAdmin allowed" });
};

