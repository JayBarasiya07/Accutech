// routes/cooling.js
import express from "express";
import Cooling from "../models/Cooling.js"; // make sure this is the correct model file
import { verifyToken, isAdminOrSuperAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ================= GET ALL COOLING =================
router.get("/", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const coolingData = await Cooling.find().sort({ createdAt: -1 });
    return res.status(200).json(coolingData);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= CREATE COOLING =================
router.post("/", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const newCooling = new Cooling(req.body);
    await newCooling.save();
    return res.status(201).json(newCooling);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= UPDATE COOLING =================
router.put("/:id", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const updatedCooling = await Cooling.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCooling) {
      return res.status(404).json({ message: "Cooling record not found" });
    }

    return res.status(200).json(updatedCooling);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= DELETE COOLING =================
router.delete("/:id", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const deletedCooling = await Cooling.findByIdAndDelete(req.params.id);

    if (!deletedCooling) {
      return res.status(404).json({ message: "Cooling record not found" });
    }

    return res.status(200).json({ message: "Cooling record deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
