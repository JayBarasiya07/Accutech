import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET: Fetch logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// PUT: Update profile (name, email, mobile)
export const updateProfile = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, mobile },
      { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

// PUT: Change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password change failed" });
  }
};
