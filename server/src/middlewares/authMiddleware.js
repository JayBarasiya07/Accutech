import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ================= VERIFY TOKEN =================
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // 🔑 attach logged-in user
    next();
  } catch (error) {
    console.error("Token error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

// ================= ADMIN OR SUPERADMIN =================
export const isAdminOrSuper = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Admins only" });
};

// ================= SUPERADMIN ONLY =================
export const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "SuperAdmin only" });
  }

  next();
};
