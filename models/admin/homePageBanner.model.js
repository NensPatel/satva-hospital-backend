import mongoose from "mongoose";

const homePageBannerSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    homeBannerType: {
      type: String,
      enum: ["image", "video"],
      lowercase: true,
      index: true,
    },
    homeBannerTitle: {
      type: String,
      trim: true,
      index: true,
    },
    homeBannerLink: {
      type: String,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    desktopImageHome: { 
        type: String, 
        trim: true 
    },
    mobileImageHome: {
        type: String,
        trim: true
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

export default mongoose.model("home-banner", homePageBannerSchema);
