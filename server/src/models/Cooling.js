import mongoose from "mongoose";

const coolingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Cooling = mongoose.model("Cooling", coolingSchema);
export default Cooling;
