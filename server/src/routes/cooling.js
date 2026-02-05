import express from "express";
import Cooling from "../models/Cooling.js";
import { verifyToken, isAdminOrSuper } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =======================
   GET ALL (Admin/Super)
======================= */
router.get("/", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    const coolings = await Cooling.find().sort({ createdAt: -1 });
    res.status(200).json(coolings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   CREATE (Admin/Super)
======================= */
router.post("/", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ message: "Cooling name is required" });
    }

    const exists = await Cooling.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Cooling already exists" });
    }

    const cooling = await Cooling.create({ name });
    res.status(201).json(cooling);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Cooling already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   UPDATE (Admin/Super)
======================= */
router.put("/:id", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ message: "Cooling name is required" });
    }

    const duplicate = await Cooling.findOne({
      name,
      _id: { $ne: req.params.id },
    });

    if (duplicate) {
      return res.status(400).json({ message: "Cooling already exists" });
    }

    const updated = await Cooling.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Cooling not found" });
    }

    res.json(updated);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Cooling already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   DELETE (Admin/Super)
======================= */
router.delete("/:id", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    const deleted = await Cooling.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Cooling not found" });
    }

    res.json({ message: "Cooling deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
