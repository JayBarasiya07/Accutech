import express from "express";
import Cooling from "../models/Cooling.js"; // make sure the import matches your file

const router = express.Router();

// GET all coolings
router.get("/", async (req, res) => {
  try {
    const coolings = await Cooling.find().sort({ createdAt: -1 });
    res.json(coolings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch coolings" });
  }
});

// CREATE new cooling
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Cooling.findOne({ name });
    if (existing) return res.status(400).json({ error: "Cooling already exists" });

    const newCooling = new Cooling({ name });
    await newCooling.save();
    res.status(201).json(newCooling);
  } catch (err) {
    res.status(500).json({ error: "Failed to create cooling" });
  }
});

// UPDATE cooling
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Cooling.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Cooling not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update cooling" });
  }
});

// DELETE cooling
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Cooling.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Cooling not found" });
    res.json({ message: "Cooling deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete cooling" });
  }
});

export default router;
