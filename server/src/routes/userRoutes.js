import express from "express";
import User from "../models/User.js";
import {
  verifyToken,
  isAdminOrSuperAdmin,
  isSuperAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// ================= GET ALL USERS =================
// Admin + SuperAdmin
router.get("/", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// ================= UPDATE ROLE =================
// SuperAdmin only
router.put("/:id/role", verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!role || !["user", "admin", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Prevent SuperAdmin changing his own role
    if (req.user._id.toString() === req.params.id) {
      return res.status(403).json({
        message: "You cannot change your own role",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Role updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// ================= DELETE USER =================
// SuperAdmin only
router.delete("/:id", verifyToken, isSuperAdmin, async (req, res) => {
  try {
    // Prevent SuperAdmin deleting himself
    if (req.user._id.toString() === req.params.id) {
      return res.status(403).json({
        message: "You cannot delete your own account",
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

export default router;
