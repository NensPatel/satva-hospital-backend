// models/disorderSection.js
import mongoose from "mongoose";

const disorderSectionSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    disorder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "disorder",
      required: true,
    },
    title: {
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

export default mongoose.model("DisorderSection", disorderSectionSchema);
