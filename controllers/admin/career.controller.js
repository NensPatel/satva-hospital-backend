import careersSchema from "../../models/admin/career.model.js";
import emailSettingsSchema from "../../models/admin/emailsetting.model.js";
import { sendMail } from "../../helpers/mail.js";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createCareer = async (req, res) => {
  try {
    const { name, email, contactNo, experience, subject, message } = req.body;
    
     const uploadFile = req.files.find((file) => file.fieldname === "uploadFile");
    if (!uploadFile) {
      return res.status(400).send({
        isSuccess: false,
        message: "File is required.",
      });
    }
    const uploadFilePath = "career/" + uploadFile.filename.replace(/\s+/g, "-");
    const attachmentPath = path.join(__dirname, "../../public", uploadFilePath);

    const createObj = {
      name,
      email,
      contactNo,
      experience,
      subject,
      message,
      uploadFile: uploadFilePath,
    };
    const saveData = await careersSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
       const getEmailData = await emailSettingsSchema.findOne();
if (!getEmailData || !getEmailData.careerTemplate) {
  return res.status(400).send({
    isSuccess: false,
    message: "Career email template not found in email settings."
  });
}

const fromEmail1 = getEmailData.fromEmail1;
const ccEmail1 = getEmailData.ccEmail1;
const bccEmail1 = getEmailData.bccEmail1;
const careerSubject = getEmailData.careerSubject;

let careerTemplate = getEmailData.careerTemplate;
        careerTemplate = careerTemplate.replace(/\[FIRSTNAME\]/g, name);
        careerTemplate = careerTemplate.replace(/\[EMAIL\]/g, email);
        careerTemplate = careerTemplate.replace(/\[CONTACTNO\]/g, contactNo);
        careerTemplate = careerTemplate.replace(/\[EXPERIENCE\]/g, experience);
        careerTemplate = careerTemplate.replace(/\[SUBJECT\]/g, subject);
        careerTemplate = careerTemplate.replace(/\[MESSAGE\]/g, message);
        await sendMail(
          fromEmail1,
          careerSubject,
          careerTemplate,
          ccEmail1,
          bccEmail1,
            [
            {
              filename: uploadFile.originalname,
              path: attachmentPath,
            },
          ]
        );
        return res.status(200).send({
          isSuccess: true,
          message: `Thank you for applying! We'll contact you if your profile matches our requirements.`,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getAllCareer = async (req, res) => {
  try {
    const getData = await careersSchema.find().sort({ createdAt: -1 });
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
    const career_id = req.body.career_id;
    const getData = await careersSchema.findById(career_id);
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
    const career_id = req.query.career_id;
    await careersSchema
      .findByIdAndDelete(career_id)
      .then(async (data) => {
        if (!data) {
          return res
            .status(404)
            .send({ message: "Data not found!", isSuccess: false });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Data deleted successfully.",
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
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
    const getData = await careersSchema
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await careersSchema.countDocuments();
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
