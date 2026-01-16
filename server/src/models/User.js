// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true }, // ✅ Mobile
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
});

const User = mongoose.model("User", userSchema);

export default User;
