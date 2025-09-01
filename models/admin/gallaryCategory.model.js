import mongoose from "mongoose";

const gallaryCategorySchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    categoryName: {
      type: String,
      trim: true,
      index: true,
    },  
    gallaryTitleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gallary_title",
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    gallaryImagesId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "gallary_images" }],
      trim: true,
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("gallary_category", gallaryCategorySchema);
