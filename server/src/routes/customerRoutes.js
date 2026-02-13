import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET ALL
router.get("/", verifyToken, getAllCustomers);

// GET BY ID
router.get("/:id", verifyToken, getCustomerById);

// CREATE
router.post("/", verifyToken, createCustomer);

// UPDATE
router.put("/:id", verifyToken, updateCustomer);

// DELETE
router.delete("/:id", verifyToken, deleteCustomer);

export default router;
