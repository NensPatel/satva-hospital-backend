import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctors",
      required: true,
    },
    fullName: { 
        type: String, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true 
    },
    phone: { 
        type: String, 
        required: true, 
        trim: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    }, 
    message: { 
        type: String, 
        trim: true 
    },
  },
  { timestamps: true }
);

export default mongoose.model("appointment", appointmentSchema);
