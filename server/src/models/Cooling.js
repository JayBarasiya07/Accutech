import mongoose from "mongoose";

const coolingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // prevent duplicate categories
      trim: true,
    },
  },
  { timestamps: true }
);

const Cooling = mongoose.model("Cooling", coolingSchema);

export default Cooling;