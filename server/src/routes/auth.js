import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, mobile, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await user.save();

    // Send OTP to email
    await sendEmail(email, "Verify Your Email", `Your OTP is: ${otp}`);

    res.status(201).json({ message: "User registered, OTP sent to email", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
