import mongoose from "mongoose";

const cashlessFacilitySchema = new mongoose.Schema(
  {
     sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      index: true,
    },
    logo: {
      type: String, 
      trim: true
     },
    link: {
      type: String, 
      trim: true,
      index: true
    }, 
    isActive: {
     type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("cashless_facilities", cashlessFacilitySchema);
