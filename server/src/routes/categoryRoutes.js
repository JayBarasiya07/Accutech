import express from "express";
import Category from "../models/Category.js";
import { verifyToken, isAdminOrSuperAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ---------------- GET ALL CATEGORIES ----------------
// Admin + SuperAdmin can view
router.get("/", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json(categories);
  } catch (err) {
    console.error("GET Categories Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ---------------- CREATE CATEGORY ----------------
// Admin + SuperAdmin can create
router.post("/", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name: name.trim() });
    await newCategory.save();

    return res.status(201).json(newCategory);
  } catch (err) {
    console.error("CREATE Category Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ---------------- UPDATE CATEGORY ----------------
// Admin + SuperAdmin can update
router.put("/:id", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error("UPDATE Category Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE CATEGORY ----------------
// Admin + SuperAdmin can delete
router.delete("/:id", verifyToken, isAdminOrSuperAdmin, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("DELETE Category Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
