// server/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not defined in .env");

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected ✅ Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection FAILED ❌", error.message);
    process.exit(1);
  }
};

export default connectDB;
