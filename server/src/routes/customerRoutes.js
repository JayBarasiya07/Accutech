import express from "express";
import { verifyToken, isAdminOrSuper } from "../middlewares/authMiddleware.js";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

// ✅ USER / ADMIN / SUPERADMIN -> can view list
router.get("/", verifyToken, getCustomers);
router.get("/:id", verifyToken, getCustomerById);

// ✅ ADMIN / SUPERADMIN only -> CRUD
router.post("/", verifyToken, isAdminOrSuper, createCustomer);
router.put("/:id", verifyToken, isAdminOrSuper, updateCustomer);
router.delete("/:id", verifyToken, isAdminOrSuper, deleteCustomer);

export default router;