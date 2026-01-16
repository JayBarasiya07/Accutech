import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";   // <-- This path must exist
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import verifyRoutes from "./routes/verify.js";
import { sendEmail } from "./utils/sendEmail.js";




dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

const run = async () => {
  try {
    await sendEmail({
      to: "recipient@example.com",
      subject: "Test Email ✔",
      text: "Hello! This is a test email sent from Node.js 😎",
      html: "<h1>Hello!</h1><p>This is a test email sent from Node.js 😎</p>",
    });
  } catch (err) {
    console.error(err);
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/verify", verifyRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
