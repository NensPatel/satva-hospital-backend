import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    galleryCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gallary_category",
      required: true,
      index: true,
    },
    gallary_image: {
      type: String,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    img_title: {
      type: String, 
      required: false,
      trim: true,
    },
   
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("gallary_images", galleryImageSchema);
