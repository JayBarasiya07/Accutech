import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    srNo: String,
    category: String,
    customername: String,
    salesPerson: String,
    offices: String,
    plants: String,
    location: String,
    contactPerson: String,
    department: String,
    designation: String,
    mobile: String,
    email: String,
    decision: String,
    currentUPS: String,
    scopeSRC: String,
    racks: String,
    cooling: String,
    roomAge: String,

    // ✅ FIXED createdBy (inside schema)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
