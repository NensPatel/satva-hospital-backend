import mongoose from "mongoose";

const jobPositionSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      trim: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("job_position", jobPositionSchema);
