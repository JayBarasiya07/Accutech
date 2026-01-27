import express from "express";
import { registerUser, verifyOtp, loginUser, resendOtp, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// Registration → send OTP
router.post("/register", registerUser);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Resend OTP
router.post("/resend-otp", resendOtp);

// Login
router.post("/login", loginUser);

// Forgot Password → send OTP
router.post("/forgot-password", forgotPassword);

// Reset Password using OTP
router.post("/reset-password", resetPassword);

export default router;
