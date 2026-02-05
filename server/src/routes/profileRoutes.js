import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getProfile } from "../controllers/profileController.js";

const router = express.Router();

// User must be logged in
router.get("/", verifyToken, getProfile);

export default router;
