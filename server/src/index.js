import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import verifyRoutes from "./routes/verify.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cooling from "./routes/cooling.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/categories", categoryRoutes); // ← this is key
app.use("/api/cooling",cooling
  
);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
