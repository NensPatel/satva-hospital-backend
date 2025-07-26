import mongoose from "mongoose";

const websiteSettingSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true
  },
  slogan: {
    type: String
  },
  description: {
    type: String
  },
  mapLink: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  email1: {
    type: String,
    required: true
  },
  email2: {
    type: String
  },
  contact1: {
    type: String,
    required: true
  },
  contact2: {
    type: String
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
  logoHeader: {  
    type: String
  },
  logoFooter: {   
    type: String
  }
}, { timestamps: true });

export default mongoose.model("WebsiteSetting", websiteSettingSchema);
