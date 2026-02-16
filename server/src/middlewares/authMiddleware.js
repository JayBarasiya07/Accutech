import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ===============================
// ✅ VERIFY TOKEN
// ===============================
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

// ===============================
// ✅ USER ONLY
// ===============================
export const isUser = (req, res, next) => {
  if (req.user.role === "user") {
    return next();
  }
  return res.status(403).json({ message: "User only access" });
};

// ===============================
// ✅ ADMIN ONLY
// ===============================
export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin only access" });
};

// ===============================
// ✅ SUPERADMIN ONLY
// ===============================
export const isSuperAdmin = (req, res, next) => {
  if (req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Only SuperAdmin allowed" });
};

// ===============================
// ✅ ADMIN OR SUPERADMIN
// ===============================
export const isAdminOrSuperAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied (Admin/SuperAdmin only)" });
};

// ===============================
// ✅ ADMIN CAN MANAGE ONLY USERS
// SUPERADMIN CAN MANAGE ADMIN + USERS
// ===============================
export const canManageUser = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const targetUserId = req.params.id;

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // ✅ SuperAdmin can manage all
    if (loggedInUser.role === "superadmin") {
      return next();
    }

    // ✅ Admin can manage only users
    if (loggedInUser.role === "admin") {
      if (targetUser.role === "user") {
        return next();
      }

      return res.status(403).json({
        message: "Admin can manage only Users (not Admin/SuperAdmin)",
      });
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    return res.status(500).json({ message: "canManageUser middleware failed" });
  }
};

// ===============================
// ✅ PERMISSION FILTER (Customer List)
// ===============================
export const permissionFilter = (req, res, next) => {
  try {
    if (req.user.role === "superadmin" || req.user.role === "admin") {
      req.allowedFields = null;
      return next();
    }

    const permissions = req.user.permissions || {};

    const allowedFields = Object.keys(permissions).filter(
      (key) => permissions[key] === true
    );

    req.allowedFields = allowedFields;

    next();
  } catch (error) {
    res.status(500).json({ message: "Permission middleware failed" });
  }
};

