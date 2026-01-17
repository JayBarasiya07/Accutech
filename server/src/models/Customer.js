// models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  srNo: String,           // changed from Sr_No.
  category: String,
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
});

export default mongoose.model("Customer", customerSchema);
