import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";
const OTP_EXPIRY_SEC = 255; // 255 seconds OTP expiry

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  const { name, email, mobile, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ msg: "Passwords do not match" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + OTP_EXPIRY_SEC * 1000);

    const user = new User({ name, email, mobile, password: hashedPassword, otp, otpExpires });
    await user.save();

    await sendEmail(email, "Verify Your Email", `<h3>Your OTP is: ${otp}</h3><p>Valid for ${OTP_EXPIRY_SEC} seconds</p>`);

    res.status(201).json({ msg: "User registered, OTP sent", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.isVerified) return res.status(400).json({ msg: "User already verified" });
    if (user.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });
    if (user.otpExpires < new Date()) return res.status(400).json({ msg: "OTP expired" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ msg: "Email verified successfully 🎉" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- RESEND OTP ----------------
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.isVerified) return res.status(400).json({ msg: "Email already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + OTP_EXPIRY_SEC * 1000);
    await user.save();

    await sendEmail(email, "Resend OTP", `<h3>Your new OTP is: ${otp}</h3><p>Valid for ${OTP_EXPIRY_SEC} seconds</p>`);

    res.json({ msg: "New OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    if (!user.isVerified) return res.status(400).json({ msg: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      msg: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- FORGOT PASSWORD ----------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + OTP_EXPIRY_SEC * 1000);
    await user.save();

    await sendEmail(email, "Password Reset OTP", `<h3>Your OTP is: ${otp}</h3><p>Valid for ${OTP_EXPIRY_SEC} seconds</p>`);

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- RESET PASSWORD ----------------
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ msg: "OTP expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ msg: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
