import mongoose from "mongoose";

const emailSettingsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    host: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    port: {
      type: Number,
      required: true,
      trim: true,
      index: true,
    },
    fromEmail: {
      type: String,
      trim: true,
      index: true,
    },
    bccEmail: {
      type: String,
      trim: true,
      index: true,
    },
    ccEmail: {
      type: String,
      trim: true,
      index: true,
    },
    careerTemplate: {
      type: String,
      index: true,
    },
    careerSubject: {
      type: String,
      index: true,
    },
    fromEmail1: {
      type: String,
      trim: true,
      index: true,
    },
    bccEmail1: {
      type: String,
      trim: true,
      index: true,
    },
    ccEmail1: {
      type: String,
      trim: true,
      index: true,
    },
    inquiryTemplate: {
      type: String,
      index: true,
    },
    inquirySubject: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("emailSettings", emailSettingsSchema);
