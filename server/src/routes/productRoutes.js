import express from "express";
import upload from "../middlewares/upload.js";

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
  isSuperAdmin
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ================= ADD PRODUCT =================
router.post(
  "/",
  verifyToken,
  isSuperAdmin,
  upload.single("image"),
  addProduct
);


// ================= GET ALL PRODUCTS =================
router.get(
  "/",
  verifyToken,
  getProducts
);


// ================= GET SINGLE PRODUCT =================
router.get(
  "/:id",
  verifyToken,
  getProductById
);


// ================= UPDATE PRODUCT =================
router.put(
  "/:id",
  verifyToken,
  isSuperAdmin,
  upload.single("image"),
  updateProduct
);


// ================= DELETE PRODUCT =================
router.delete(
  "/:id",
  verifyToken,
  isSuperAdmin,
  deleteProduct
);

export default router;