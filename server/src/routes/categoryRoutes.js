// routes/category.js
import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new category
router.post("/", async (req, res) => {
  const { category, cooling } = req.body;
  if (!category || !cooling)
    return res.status(400).json({ error: "Category and Cooling are required" });

  try {
    const existing = await Category.findOne({ category });
    if (existing) return res.status(400).json({ error: "Category already exists" });

    const newCat = new Category({ category, cooling });
    await newCat.save();
    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update category
router.put("/:id", async (req, res) => {
  const { category, cooling } = req.body;
  if (!category || !cooling)
    return res.status(400).json({ error: "Category and Cooling are required" });

  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { category, cooling },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
