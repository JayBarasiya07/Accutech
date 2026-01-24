import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true },      // Use Number instead of int
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user", "superadmin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },                          // Store OTP as String (allows leading zeros)
  otpExpires: { type: Date },    
   permissions: { type: Object, default: {} },                 // OTP expiry timestamp
}, { timestamps: true });

export default mongoose.model("User", userSchema);
