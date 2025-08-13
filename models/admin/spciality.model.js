import mongoose from "mongoose";

const specialitiesSchema = new mongoose.Schema(
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
    speciality_img: {
      type: String,
      trim: true,
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
