import mongoose from "mongoose";

const aboutUsTabsSchema = new mongoose.Schema(
  {
      about_img_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "about_us_image",
      index: true,
    },
     sort_order_no: { 
      type: Number, 
      trim: true,
      index: true,
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

export default mongoose.model("about_us_tabs", aboutUsTabsSchema);
