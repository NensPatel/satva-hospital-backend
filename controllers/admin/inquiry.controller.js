import inqSchema from "../../models/admin/inquiry.model.js";
import emailSettingsSchema from "../../models/admin/emailsetting.model.js";
import { sendMail } from "../../helpers/mail.js";

export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const createObj = {
      name,
      email,
      phone,
      message,
    };
    const saveData = await inqSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        const getEmailData = await emailSettingsSchema.findOne();
        const fromEmailInquiry = getEmailData.fromEmailInquiry;
        const ccEmailInquiry = getEmailData.ccEmailInquiry;
        const bccEmailInquiry = getEmailData.bccEmailInquiry;
        const inquirySubject = getEmailData.inquirySubject;
        let inquiryTemplate = getEmailData.inquiryTemplate;
        inquiryTemplate = inquiryTemplate.replace(/\[FIRSTNAME\]/g, name);
        inquiryTemplate = inquiryTemplate.replace(/\[EMAIL\]/g, email);
        inquiryTemplate = inquiryTemplate.replace(/\[PHONE\]/g, phone);
        inquiryTemplate = inquiryTemplate.replace(/\[MESSAGE\]/g, message);
        await sendMail(
          fromEmailInquiry,
          inquirySubject,
          inquiryTemplate,
          ccEmailInquiry,
          bccEmailInquiry
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

export const getAllInquiry = async (req, res) => {
  try {
    const getData = await inqSchema
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("name email phone message createdAt");
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
    const inquiry_id = req.body.inquiry_id;
    const getData = await inqSchema.findById(inquiry_id);
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

export const deleteInquiry = async (req, res) => {
  try {
     const inquiry_id = req.query.inquiry_id;
    await inqSchema
      .findByIdAndDelete(inquiry_id)
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
    const getData = await inqSchema
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await inqSchema.countDocuments();
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
