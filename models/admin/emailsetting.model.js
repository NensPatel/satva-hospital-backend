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
    fromEmailInquiry: {
      type: String,
      trim: true,
      index: true,
    },
    bccEmailInquiry: {
      type: String,
      trim: true,
      index: true,
    },
    ccEmailInquiry: {
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
    fromEmailCareer: {
      type: String,
      trim: true,
      index: true,
    },
    bccEmailCareer: {
      type: String,
      trim: true,
      index: true,
    },
    ccEmailCareer: {
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
    appointmentTemplate: {
      type: String,
      index: true,
    },
    appointmentSubject: {
      type: String,
      index: true,
    },
    fromEmailCallback: {
      type: String,
      trim: true,
      index: true,
    },
    bccEmailCallback: {
      type: String,
      trim: true,  
      index: true,
    },
    ccEmailCallback: {
      type: String,
      trim: true,
      index: true,
    },
    callbackTemplate: {
      type: String,
      index: true,  
    },
    callbackSubject: {
      type: String,
      index: true,
    },

  },
  { timestamps: true }
);
export default mongoose.model("emailSettings", emailSettingsSchema);
