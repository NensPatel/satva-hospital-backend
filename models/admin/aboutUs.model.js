import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema(
  {
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
    about_img: {
      type: String, 
      trim: true
    },
    isActive: { 
      type: Boolean,
      default: true,
      index: true, 
    },

  },
  { timestamps: true }
);

export default mongoose.model("about_us", aboutUsSchema);
