import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";
dotenv.config();

// Register
export const registerUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const user = new User({
      name, email, mobile, password: hashed, verificationToken: token
    });

    await user.save();
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: "User registered! Check email to verify." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send("Invalid token");

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send("Email verified! You can now login.");
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.isVerified) return res.status(400).json({ error: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
