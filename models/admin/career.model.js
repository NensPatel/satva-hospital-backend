import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job_position"
    },

    // Personal Information
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Professional Information
    currentDesignation: {
      type: String,
      trim: true,
    },
    currentOrganization: {
      type: String,
      trim: true,
    },
    currentLocation: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: String,
      trim: true,
    },
    currentCTC: {
      type: String,
      trim: true,
    },
    uploadCV: {
      type: String,
      required: true,
      trim: true,
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("career", careerSchema);
