import mongoose from "mongoose";

const coolingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cooling name is required"],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cooling", coolingSchema);
