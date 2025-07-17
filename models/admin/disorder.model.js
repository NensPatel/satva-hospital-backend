import mongoose from "mongoose";

const disorderSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    speciality_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "specialities",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("disorder", disorderSchema);
