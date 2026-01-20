import express from "express";
import Cooling from "../models/Cooling.js";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const coolings = await Cooling.find().sort({ createdAt: -1 });
    res.json(coolings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Cooling required" });

  try {
    const existing = await Cooling.findOne({ name });
    if (existing) return res.status(400).json({ error: "Cooling exists" });

    const newCool = new Cooling({ name });
    await newCool.save();
    res.status(201).json(newCool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Cooling required" });

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

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Cooling.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Cooling not found" });
    res.json({ message: "Cooling deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
