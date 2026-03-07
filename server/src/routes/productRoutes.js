import express from "express";

import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import {
  verifyToken,
  isAdminOrSuperAdmin,
  isSuperAdmin,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", verifyToken, isSuperAdmin, addProduct);

router.get("/", verifyToken, getProducts);

router.get("/:id", verifyToken, getProductById);

router.put("/:id", verifyToken, isSuperAdmin, updateProduct);

router.delete("/:id", verifyToken, isSuperAdmin, deleteProduct);

export default router;