import bloodApplicationSchema from "../../models/admin/bloodDonation.model.js";
import emailSettingsSchema from "../../models/admin/emailsetting.model.js";
import { sendMail } from "../../helpers/mail.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createBloodDonation = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      age,
      gender,
      email,
      mobileNumber,
      phoneNumber,
      proofType,
      addressLine1,
      addressLine2,
      district,
      pinCode,
      preferredContactMethod,
      specialInstructions,
      previousDonor,
      bloodGroup,
      riskOfInfection,
      bloodCenterAssociation,
      past6MonthsHistory,
      chronicDiseases,
      pastSurgeriesOrTransfusions,
    } = req.body;

    const proofFile = req.files.find((file) => file.fieldname === "proofFile");
    if (!proofFile) {
      return res.status(400).send({
        isSuccess: false,
        message: "File is required.",
      });
    }
    const proofFilePath =
      "bloodDonations/" + proofFile.filename.replace(/\s+/g, "-");
    const attachmentPath = path.join(__dirname, "../../public", proofFilePath);

    const createObj = {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      age,
      gender,
      email,
      mobileNumber,
      phoneNumber,
      proofType,
      proofFile: proofFilePath,
      addressLine1,
      addressLine2,
      district,
      pinCode,
      preferredContactMethod,
      specialInstructions,
      previousDonor,
      bloodGroup,
      riskOfInfection,
      bloodCenterAssociation,
      past6MonthsHistory,
      chronicDiseases,
      pastSurgeriesOrTransfusions,
    };

    const saveData = await bloodApplicationSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        // Send mail to admin/hospital
        const getEmailData = await emailSettingsSchema.findOne();
        if (!getEmailData || !getEmailData.bloodDonateTemplate) {
          return res.status(400).send({
            isSuccess: false,
            message:
              "Blood donation email template not found in email settings.",
          });
        }

        const fromEmailBlood = getEmailData.fromEmailBlood;
        const ccEmailBlood = getEmailData.ccEmailBlood;
        const bccEmailBlood = getEmailData.bccEmailBlood;
        const subject =
          getEmailData.bloodDonateSubject || "New Blood Donation Application";

        let template = getEmailData.bloodDonateTemplate;
        template = template.replace(/\[FIRSTNAME\]/g, firstName);
        template = template.replace(/\[LASTNAME\]/g, lastName);
        template = template.replace(/\[AGE\]/g, age);
        template = template.replace(/\[EMAIL\]/g, email);
        template = template.replace(/\[MOBILE\]/g, mobileNumber);
        template = template.replace(/\[PHONE\]/g, phoneNumber);
        template = template.replace(/\[BLOODGROUP\]/g, bloodGroup);

        await sendMail(fromEmailBlood, subject, template, ccEmailBlood, bccEmailBlood, [
          {
            filename: proofFile.originalname,
            path: attachmentPath,
          },
        ]);

        return res.status(200).send({
          isSuccess: true,
          message:
           "Thank you for your interest in donating blood. We’ve received your details and will contact you soon with the next steps.",
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

// GET ALL DATA (no pagination)
export const getAllBloodDonations = async (req, res) => {
  try {
    await bloodApplicationSchema
      .find()
      .sort({ createdAt: -1 })
      .then((getData) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Data listing successfully.",
          data: getData,
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

//GET DATA BY ID
export const getDataById = async (req, res) => {
  try {
    const application_id = req.body.application_id;
    await bloodApplicationSchema
      .findById(application_id)
      .then((getData) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Get data successfully.",
          data: getData,
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

//DELETE BY ID
export const deleteBloodDonation = async (req, res) => {
  try {
    const application_id = req.query.application_id;
    await bloodApplicationSchema
      .findByIdAndDelete(application_id)
      .then((data) => {
        if (!data) {
          return res.status(404).send({
            message: "Data not found!",
            isSuccess: false,
          });
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

//GET ALL DATA WITH PAGINATION
export const getPaginationData= async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;

    const getData = await bloodApplicationSchema
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await bloodApplicationSchema.countDocuments();
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
