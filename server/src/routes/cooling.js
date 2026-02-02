import express from "express";
import Cooling from "../models/Cooling.js";
import authMiddleware, { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET all coolings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const coolings = await Cooling.find().sort({ createdAt: -1 });
    res.json(coolings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new cooling
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Cooling name is required" });

  try {
    const exists = await Cooling.findOne({ name });
    if (exists) return res.status(400).json({ error: "Cooling already exists" });

    const newCooling = new Cooling({ name });
    await newCooling.save();
    res.status(201).json(newCooling);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update cooling
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Cooling name is required" });

  try {
    const updated = await Cooling.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Cooling not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE cooling
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const deleted = await Cooling.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Cooling not found" });
    res.json({ message: "Cooling deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
