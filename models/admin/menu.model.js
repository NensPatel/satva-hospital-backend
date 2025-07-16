import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    position: {
      type: Number,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menu",
      default: null,
      index: true,
    },
    menuName: {
      type: String,
      trim: true,
      index: true,
    },
    menuUrl: {                  
      type: String,
      trim: true,
      index: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      index: true,
    },
    metaKeywords: {               
      type: String,
      trim: true,
      index: true,
    },
    metaDescription: {
      type: String,
      trim: true,
      index: true,
    },
    showInHeader: {               
      type: Boolean,
      default: true,
    },
    showInFooter: {               
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    subMenuCount: {
      type: Number,
      default: 0,
    },
    subMenu: [],                  
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("menu", menuSchema);
