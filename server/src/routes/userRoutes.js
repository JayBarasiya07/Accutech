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

    if (!["user", "admin", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // 🚨 Prevent self role change
    if (req.user._id.toString() === req.params.id) {
      return res.status(403).json({
        message: "You cannot change your own role",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      message: "Role updated successfully",
      user: await User.findById(user._id).select("-password"),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});


// ================= UPDATE PERMISSIONS =================
// SuperAdmin only
router.put("/:id/permissions", verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!permissions || typeof permissions !== "object") {
      return res.status(400).json({
        message: "Invalid permissions data",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚨 Prevent editing SuperAdmin
    if (user.role === "superadmin") {
      return res.status(403).json({
        message: "You cannot modify SuperAdmin permissions",
      });
    }

    // 🚨 Only Admin permissions editable
    if (user.role !== "admin") {
      return res.status(400).json({
        message: "Permissions can only be updated for Admin",
      });
    }

    // ✅ Whitelist update (secure way)
    Object.keys(user.permissions).forEach((key) => {
      if (permissions.hasOwnProperty(key)) {
        user.permissions[key] = permissions[key];
      }
    });

    await user.save();

    return res.status(200).json({
      message: "Permissions updated successfully",
      user: await User.findById(user._id).select("-password"),
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
    // 🚨 Prevent self delete
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