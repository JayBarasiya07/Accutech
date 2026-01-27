import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
export default mongoose.model("User", userSchema);
