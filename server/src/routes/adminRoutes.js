import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Only Admin / SuperAdmin can access
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
