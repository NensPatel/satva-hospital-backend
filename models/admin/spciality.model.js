import mongoose from "mongoose";

const specialitiesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      index: true,
    },
    short_desc: {
      type: String,
      trim: true,
      index: true,
    },
    full_desc: {
      type: String,
      trim: true,
      index: true,
    },
    disorders: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "disorder" }],
      trim: true,
      default: [],
    },
    image: {
      type: String,
      trim: true,
    },
    banner: {
      type: String,
      trim: true,
    },
    sort_order_no: {
      type: Number,
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

export default mongoose.model("specialities", specialitiesSchema);
