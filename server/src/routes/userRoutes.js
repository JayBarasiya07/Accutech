import express from "express";
import { verifyToken, isAdminOrSuper, isSuperAdmin } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ================= GET ALL USERS =================
// Admin + SuperAdmin
router.get("/", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= UPDATE ROLE =================
// SuperAdmin only
router.put("/:id/role", verifyToken, isSuperAdmin, async (req, res) => {
  const { role } = req.body;

  if (!["user", "admin", "superadmin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: "Role updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= DELETE USER =================
// SuperAdmin only
router.delete("/:id", verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
