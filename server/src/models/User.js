import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    mobile: { type: Number, required: true }, // use Number, not int

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    permissions: {
      srNo: { type: Boolean, default: false },
      category: { type: Boolean, default: false },
      customername: { type: Boolean, default: false },
      salesPerson: { type: Boolean, default: false },
      offices: { type: Boolean, default: false },
      plants: { type: Boolean, default: false },
      location: { type: Boolean, default: false },
      contactPerson: { type: Boolean, default: false },
      department: { type: Boolean, default: false },
      designation: { type: Boolean, default: false },
      mobile: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
      decision: { type: Boolean, default: false },
      currentUPS: { type: Boolean, default: false },
      scopeSRC: { type: Boolean, default: false },
      racks: { type: Boolean, default: false },
      cooling: { type: Boolean, default: false },
      roomAge: { type: Boolean, default: false },
    },

    isVerified: { type: Boolean, default: false },
    otp: { type: String },        // store OTP as string
    otpExpires: { type: Date },   // OTP expiry timestamp
  },
  { timestamps: true }
);

// -----------------------------
// Hash password before saving
// -----------------------------
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
