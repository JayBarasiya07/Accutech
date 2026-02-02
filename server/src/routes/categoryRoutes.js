import express from "express";
import Category from "../models/Category.js";
import authMiddleware, { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET all categories
router.get("/", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new category
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Category name is required" });

  try {
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ error: "Category already exists" });

    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update category
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Category name is required" });

  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE category
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
