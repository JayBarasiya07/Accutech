import express from "express";
import Customer from "../models/Customer.js";
import { protect } from "../middleware/auth.js"; // optional: admin-only access

const router = express.Router();

// ====================== GET ALL CUSTOMERS ======================
router.get("/", protect("admin"), async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================== GET SINGLE CUSTOMER ======================
router.get("/:id", protect("admin"), async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================== CREATE NEW CUSTOMER ======================
router.post("/", protect("admin"), async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ====================== UPDATE CUSTOMER ======================
router.put("/:id", protect("admin"), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return updated doc
    });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ====================== DELETE CUSTOMER ======================
router.delete("/:id", protect("admin"), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
