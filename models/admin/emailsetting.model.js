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
    fromEmailBlood: {
      type: String,
      trim: true,
      index: true,
    },
    bccEmailBlood: {
      type: String,
      trim: true,
      index: true,
    },
    ccEmailBlood: {
      type: String,
      trim: true,
      index: true,
    },
    bloodDonateTemplate: {
      type: String,
      index: true,
    },
    bloodDonateSubject: {
      type: String,
      index: true,
    },
     fromEmailAppointment: {
      type: String,
      trim: true,
      index: true,
    },
    bccEmailAppointment: {
      type: String,
      trim: true,
      index: true,
    },
    ccEmailAppointment: {
      type: String,
      trim: true,
      index: true,
    },
    AppointmentTemplate: {
      type: String,
      index: true,
    },
    AppointmentSubject: {
      type: String,
      index: true,
    },

  },
  { timestamps: true }
);
export default mongoose.model("emailSettings", emailSettingsSchema);
