import callbackSchema from "../../models/admin/callback.model.js";
import emailSettingsSchema from "../../models/admin/emailsetting.model.js";
import { sendMail } from "../../helpers/mail.js";

export const createCallback = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    const saveData = new callbackSchema({ fullName, email, phone });
    await saveData.save();

    const getEmailData = await emailSettingsSchema.findOne();
    if (!getEmailData || !getEmailData.callbackTemplate) {
      return res.status(500).send({
        isSuccess: false,
        message: "Email template for callback is not configured.",
      });
    }

    const fromEmailCallback = getEmailData.fromEmailCallback;
    const ccEmailCallback = getEmailData.ccEmailCallback;
    const bccEmailCallback = getEmailData.bccEmailCallback;
    const callbackSubject = getEmailData.callbackSubject;

    let callbackTemplate = getEmailData.callbackTemplate || "";
    callbackTemplate = callbackTemplate
      .replace(/\[FULLNAME\]/g, fullName || "")
      .replace(/\[EMAIL\]/g, email || "")
      .replace(/\[PHONE\]/g, phone || "");

    await sendMail(
      fromEmailCallback,
      callbackSubject,
      callbackTemplate,
      ccEmailCallback,
      bccEmailCallback
    );

    return res.status(200).send({
      isSuccess: true,
      message:
        "Thank you for reaching out to Satva Hospital. We’ve received your request and our team will be in touch with you shortly.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};


export const getAllCallback = async (req, res) => {
  try {
    const getData = await callbackSchema.find({ isActive: true }).sort({ createdAt: -1 });
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
    const callback_id = req.body.callback_id;
    const getData = await callbackSchema.findById(callback_id);
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

export const deleteCallback = async (req, res) => {
  try {
     const callback_id = req.query.callback_id;
    await callbackSchema
      .findByIdAndDelete(callback_id)
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
    const getData = await callbackSchema
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await callbackSchema.countDocuments();
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
