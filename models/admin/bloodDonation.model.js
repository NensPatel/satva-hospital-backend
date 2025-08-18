import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    // Personal Info
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
      trim: true,
    },
    email: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    phoneNumber: { type: String, trim: true },
    proofType: { type: String, required: true, trim: true },
    proofFile: { type: String, trim: true },

    // Contact Details
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    district: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true, trim: true },
    preferredContactMethod: { type: String, required: true, trim: true },
    specialInstructions: {
      dnd: { type: Boolean, default: false },
      contactAtNight: { type: Boolean, default: false },
      duringOfficialHours: { type: Boolean, default: false },
      manualTimings: { type: Boolean, default: false },
      other: { type: String, trim: true },
    },

    // Medical Info
    previousDonor: { type: Boolean, required: true },
    bloodGroup: { type: String, required: true },
    riskOfInfection: { type: Boolean, required: true },
    bloodCenterAssociation: { type: String, required: true },

    past6MonthsHistory: {
      unexplainedWeightLoss: { type: Boolean, default: false },
      repeatedDiarrhoea: { type: Boolean, default: false },
      swollenGlands: { type: Boolean, default: false },
      continuousLowGradeFever: { type: Boolean, default: false },
      tattooing: { type: Boolean, default: false },
      earPiercing: { type: Boolean, default: false },
      dentalExtraction: { type: Boolean, default: false },
    },

    chronicDiseases: {
      heartDisease: { type: Boolean, default: false },
      lungDisease: { type: Boolean, default: false },
      kidneyDisease: { type: Boolean, default: false },
      cancer: { type: Boolean, default: false },
      epilepsy: { type: Boolean, default: false },
      diabetes: { type: Boolean, default: false },
      tuberculosis: { type: Boolean, default: false },
      abnormalBleeding: { type: Boolean, default: false },
      hepatitis: { type: Boolean, default: false },
      allergies: { type: Boolean, default: false },
      jaundice: { type: Boolean, default: false },
      std: { type: Boolean, default: false },
      malaria: { type: Boolean, default: false },
      typhoid: { type: Boolean, default: false },
      faintingSpells: { type: Boolean, default: false },
    },

    pastSurgeriesOrTransfusions: {
      majorSurgery: { type: Boolean, default: false },
      minorSurgery: { type: Boolean, default: false },
      bloodTransfusion: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);
