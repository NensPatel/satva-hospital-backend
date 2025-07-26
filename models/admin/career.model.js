import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    contactNo: {
      type: String,
      required: true,
      trim: true
    },
    experience: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      trim: true
    },
    uploadFile: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("career", careerSchema);
