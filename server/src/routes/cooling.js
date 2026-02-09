import express from "express";
import Cooling from "../models/Cooling.js";
import { verifyToken, isAdminOrSuper } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ===========================
   GET ALL COOLING PRODUCTS
=========================== */
router.get("/", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    const coolings = await Cooling.find().sort({ createdAt: -1 });
    res.status(200).json(coolings);
  } catch (error) {
    console.error("Cooling Fetch Error:", error);
    res.status(500).json({ message: "Server error while fetching cooling items" });
  }
});

/* ===========================
   CREATE COOLING ITEM
=========================== */
router.post("/", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Cooling name is required" });
    }

    name = name.trim();

    const exists = await Cooling.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Cooling item already exists" });
    }

    const newCooling = await Cooling.create({ name });

    res.status(201).json(newCooling);

  } catch (error) {
    console.error("Cooling Create Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Cooling item already exists" });
    }

    res.status(500).json({ message: "Server error while creating cooling item" });
  }
});

/* ===========================
   UPDATE COOLING ITEM
=========================== */
router.put("/:id", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Cooling name is required" });
    }

    name = name.trim();

    // check duplicate name except current id
    const duplicate = await Cooling.findOne({
      name,
      _id: { $ne: req.params.id }
    });

    if (duplicate) {
      return res.status(400).json({ message: "Cooling item already exists" });
    }

    const updatedCooling = await Cooling.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCooling) {
      return res.status(404).json({ message: "Cooling item not found" });
    }

    res.status(200).json(updatedCooling);

  } catch (error) {
    console.error("Cooling Update Error:", error);
    res.status(500).json({ message: "Server error while updating cooling item" });
  }
});

/* ===========================
   DELETE COOLING ITEM
=========================== */
router.delete("/:id", verifyToken, isAdminOrSuper, async (req, res) => {
  try {
    const deletedCooling = await Cooling.findByIdAndDelete(req.params.id);

    if (!deletedCooling) {
      return res.status(404).json({ message: "Cooling item not found" });
    }

    res.status(200).json({ message: "Cooling item deleted successfully" });

  } catch (error) {
    console.error("Cooling Delete Error:", error);
    res.status(500).json({ message: "Server error while deleting cooling item" });
  }
});

export default router;
