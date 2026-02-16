import express from "express";
import Customer from "../models/customerModel.js";
import { verifyToken, isAdminOrSuperAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ============================
// ✅ GET ALL CUSTOMERS (USER/ADMIN/SUPERADMIN)
// ============================
router.get("/", verifyToken, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    return res.status(200).json(customers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ============================
// ✅ GET SINGLE CUSTOMER (VIEW)
// ============================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(customer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ============================
// ✅ ADD CUSTOMER (ONLY ADMIN/SUPERADMIN)
// ============================
router.post("/", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const newCustomer = new Customer({
      ...req.body,
      createdBy: req.user._id, // who created
    });

    await newCustomer.save();

    return res.status(201).json({ message: "Customer added successfully", customer: newCustomer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ============================
// ✅ UPDATE CUSTOMER (ONLY ADMIN/SUPERADMIN)
// ============================
router.put("/:id", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ============================
// ✅ DELETE CUSTOMER (ONLY ADMIN/SUPERADMIN)
// ============================
router.delete("/:id", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
