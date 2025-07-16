// models/admin/healthInfo.model.js

import mongoose from "mongoose";

const healthInfoSchema = new mongoose.Schema(
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
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
     index: true,
    },
    blog_img: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      default: "Admin",
      trim: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("health_infos", healthInfoSchema);
