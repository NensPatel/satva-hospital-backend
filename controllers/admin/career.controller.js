import Career from "../../models/admin/career.model.js";
import emailSettingsSchema from "../../models/admin/emailsetting.model.js";
import { sendMail } from "../../helpers/mail.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createCareer = async (req, res) => {
  try {
    const {
      position,
      fullName,
      dob,
      phone,
      email,
      currentDesignation,
      currentOrganization,
      currentLocation,
      yearsOfExperience,
      currentCTC,
      additionalInfo,
    } = req.body;

    const uploadFile = req.files.find((file) => file.fieldname === "uploadCV");
    if (!uploadFile) {
      return res.status(400).send({
        isSuccess: false,
        message: "CV file is required.",
      });
    }

    const uploadFilePath = "career/" + uploadFile.filename.replace(/\s+/g, "-");
    const attachmentPath = path.join(__dirname, "../../public", uploadFilePath);

    // Save new application
    const saveData = await Career.create({
      position,
      fullName,
      dob,
      phone,
      email,
      currentDesignation,
      currentOrganization,
      currentLocation,
      yearsOfExperience,
      currentCTC,
      additionalInfo,
      uploadCV: uploadFilePath,
    });

    const populatedCareer = await Career.findById(saveData._id).populate("position", "title");

    const getEmailData = await emailSettingsSchema.findOne();
    if (getEmailData && getEmailData.careerTemplate) {
      let careerTemplate = getEmailData.careerTemplate;

      careerTemplate = careerTemplate.replace(/\[NAME\]/g, fullName);
      careerTemplate = careerTemplate.replace(/\[EMAIL\]/g, email);
      careerTemplate = careerTemplate.replace(/\[PHONE\]/g, phone);
      careerTemplate = careerTemplate.replace(/\[DOB\]/g, new Date(dob).toLocaleDateString("en-GB"));
      careerTemplate = careerTemplate.replace(/\[EXPERIENCE\]/g, yearsOfExperience);
      careerTemplate = careerTemplate.replace(/\[LOCATION\]/g, currentLocation);
      careerTemplate = careerTemplate.replace(/\[ORGANIZATION\]/g, currentOrganization || "N/A");
      careerTemplate = careerTemplate.replace(/\[CTC\]/g, currentCTC || "N/A");
      careerTemplate = careerTemplate.replace(/\[DESIGNATION\]/g, currentDesignation || "N/A");
      careerTemplate = careerTemplate.replace(/\[ADDITIONAL_INFO\]/g, additionalInfo || "N/A");
      //Replace with job position title instead of ObjectId
      const positionTitle = populatedCareer.position?.title || "N/A";
      careerTemplate = careerTemplate.replace(/\[POSITION\]/g, positionTitle);

      await sendMail(
        getEmailData.fromEmail1,
        getEmailData.careerSubject,
        careerTemplate,
        getEmailData.ccEmail1,
        getEmailData.bccEmail1,
        [
          {
            filename: uploadFile.originalname,
            path: attachmentPath,
          },
        ]
      );
    }
    return res.status(200).send({
      isSuccess: true,
      message: "Thank you for applying! We'll contact you soon.",
      data: populatedCareer,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};


// Fetch all careers with populated position
export const getAllCareer = async (req, res) => {
  try {
    const getData = await Career.find()
      .populate("position", "title") 
      .sort({ createdAt: -1 });

    return res.status(200).send({
      isSuccess: true,
      message: "Data listing successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getDataById = async (req, res) => {
  try {
    const { career_id } = req.body;
    const getData = await Career.findById(career_id).populate("position", "title");
    return res.status(200).send({
      isSuccess: true,
      message: "Get data successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    const { career_id } = req.query;
    const data = await Career.findByIdAndDelete(career_id);
    if (!data) {
      return res.status(404).send({ message: "Data not found!", isSuccess: false });
    }
    return res.status(200).send({
      isSuccess: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;

    const getData = await Career.find()
      .populate("position", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await Career.countDocuments();

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Data listing successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
