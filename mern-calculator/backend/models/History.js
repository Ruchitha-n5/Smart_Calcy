import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["calculator", "geometry", "matrix", "statistics"],
      default: "calculator",
    },
    expression: { type: String, required: true },
    result: { type: String, required: true },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("History", historySchema);
