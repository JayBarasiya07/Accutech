import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import verifyRoutes from "./routes/verify.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cooling from "./routes/cooling.js";
import customerRouter from "./routes/customerRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRouters from "./routes/adminRoutes.js";

import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cooling", cooling);
app.use("/api/profile", profileRoutes);
app.use("/api/customers", customerRouter);
app.use("/api/about", aboutRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRouters);
app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Accutech API Running..." });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
