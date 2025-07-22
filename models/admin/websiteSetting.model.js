import mongoose from "mongoose";

const websiteSettingSchema = new mongoose.Schema({
  companyName: { 
    type: String, 
    required: true 
  },
  cin: { 
    type: String, 
    required: true 
  },
  email: {  
    type: String, 
    required: true 
  },
  contactNo: {  
    type: [String],
    required: true 
  },
  officeAddress: { 
    type: String,
    required: true
  },
  factoryAddress: { 
    type: String,
    required: true
  },
  mapLink: { 
    type: String
  },
  logoHeader: {  
    type: String
  },
  logoFooter: {   
    type: String
  }
}, { timestamps: true });

export default mongoose.model("websiteSetting", websiteSettingSchema);
