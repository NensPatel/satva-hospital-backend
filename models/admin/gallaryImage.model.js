import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    galleryTitleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gallery_title",
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
      type: String, // add this field if you want to store display name
      required: false,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default mongoose.model("gallary_images", galleryImageSchema);
