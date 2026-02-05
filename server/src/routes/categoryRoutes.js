import express from "express";
import Category from "../models/Category.js";
import { verifyToken, isAdminOrSuper } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ---------------- GET ALL CATEGORIES ----------------
// Admin + SuperAdmin can view
router.get("/", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- CREATE CATEGORY ----------------
// Admin + SuperAdmin can create
router.post("/", verifyToken, isAdminOrSuper, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Category name is required" });

  try {
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- UPDATE CATEGORY ----------------
router.put("/:id", verifyToken, isAdminOrSuper, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Category name is required" });

  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Category not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE CATEGORY ----------------
router.delete("/:id", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
