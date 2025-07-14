import mongoose from "mongoose";

const patientReviewSchema = new mongoose.Schema(
  {
    sort_order_no: { 
      type: Number,
      trim: true,
      index: true,
    },
    patient_name: { 
      type: String, 
      trim: true,
      index: true,
    },
    content: { 
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
  { timestamps: true }
);

export default mongoose.model("patient_reviews", patientReviewSchema);
