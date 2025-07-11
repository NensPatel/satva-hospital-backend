import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    icon: { 
      type: String, 
      required: true,
      trim: true 
    },
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: { 
      type: String, 
      required: true,
      trim: true 
    },
    sort_order_no: { 
      type: Number, 
      default: 0,
      index: true 
    },
    isActive: { 
      type: Boolean, 
      default: true,
      index: true 
    },
  },
  { timestamps: true }
);

export default mongoose.model("features", featureSchema);
