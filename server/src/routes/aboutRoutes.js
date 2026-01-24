import express from "express";
import About from "../models/About.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

// PUBLIC: Get About content (no login needed)
router.get("/", async (req, res) => {
  try {
    const data = await About.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN / SUPERADMIN: Add section
router.post("/", authMiddleware, authorizeRoles("admin", "superadmin"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const newSection = new About({ title, description });
    const saved = await newSection.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN / SUPERADMIN: Update section
router.put("/:id", authMiddleware, authorizeRoles("admin", "superadmin"), async (req, res) => {
  try {
    const updated = await About.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN / SUPERADMIN: Delete section
router.delete("/:id", authMiddleware, authorizeRoles("admin", "superadmin"), async (req, res) => {
  try {
    await About.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
