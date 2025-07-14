import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "menu",
      index: true,
    },
    bannerType: {
      type: String,
      enum: ["image", "video"],
      lowercase: true,
      index: true,
    },
    bannerTitle: {
      type: String,
      trim: true,
      index: true,
    },
    bannerLink: {
      type: String,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    desktopImage: {
      type: String,
      trim: true,
      index: true,
    },
    mobileImage: {
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
  {
    timestamps: true,
  }
);

export default mongoose.model("banner", bannerSchema);
