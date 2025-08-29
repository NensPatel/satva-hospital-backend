import mongoose from "mongoose";

const galleryTitleSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true
    },
    gallaryCategory: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "gallary_category" }],
      trim: true,
      default: [],
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

export default mongoose.model("gallary_title", galleryTitleSchema);
