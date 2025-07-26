import mongoose from "mongoose";

const tieUpTitleSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    tieUpTitle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tieUp_title",
      required: true,
      index: true,
    },
    tieUp_image: {
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default mongoose.model("tieUp_images", tieUpTitleSchema);
