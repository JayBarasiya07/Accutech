import express from "express";
import Customer from "../models/Customer.js";
import { verifyToken, isAdminOrSuper } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin + SuperAdmin
router.get("/", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
