import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Only Admin/SuperAdmin can access this
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;
