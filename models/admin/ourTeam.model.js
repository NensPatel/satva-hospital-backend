import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema({
  name: { 
    type: String, 
    index: true,
    trim: true
 },
  designation: { 
    type: String,
    index: true,
    trim: true
},
  slug: { 
    type: String, 
    unique: true, 
    trim: true, 
    index: true 
},
  doctor_image: { 
    type: String,
    index: true,
    trim: true 
},
  socialMedia: [{
    name: { 
        type: String,
        trim: true
    },
    link: { 
        type: String,
        trim: true
     }
  }],
  sort_order_no: { 
    type: Number,
    index: true 
},
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
},
}, {
  timestamps: true
});

export default mongoose.model("doctors", doctorProfileSchema);