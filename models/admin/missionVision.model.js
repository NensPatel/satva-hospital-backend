import mongoose from "mongoose";

const missionVisionSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    icon: {
      type: String, 
      trim: true
    },
    label: {
      type: String,
      trim: true,
      index: true,
    },
    short_desc: {
      type: String,
      trim: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("mission_vision", missionVisionSchema);

