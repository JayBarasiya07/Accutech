import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = "supersecret123";

// Verify JWT
export const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ msg: "Token is invalid or expired" });
  }
};

// Check admin role
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Admin access only" });
  next();
};
