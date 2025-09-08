import mongoose from "mongoose";

const callBackSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      index: true
    },                 
    email: {
      type: String,
      trim: true,
      index: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      index: true
    },
    isActive: {
     type: Boolean,
      default: true,
      index: true,
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("callback", callBackSchema);
