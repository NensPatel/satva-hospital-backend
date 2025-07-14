import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "menu",
      default: "-",
      index: true,
    },
    menuType: {
      type: String,
      trim: true,
      index: true,
    },
    menuName: {
      type: String,
      trim: true,
      index: true,
    },
    menuURL: {
      type: String,
      trim: true,
      index: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      index: true,
    },
    metakeyword: {
      type: String,
      trim: true,
      index: true,
    },
    metaDescription: {
      type: String,
      trim: true,
      index: true,
    },
    subMenuCount: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
      index: true,
    },
    subMenu: [],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("menu", menuSchema);
