import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
    },
    stringPassword: {
      type: String,
      trim: true,
    },
    otpCode: {
      type: Number,
      default: null,
    },
    otpExpireIn: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("admin", adminSchema);
