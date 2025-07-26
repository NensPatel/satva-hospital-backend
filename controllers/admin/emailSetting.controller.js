import emailSettingsSchema from "../../models/admin/emailsetting.model.js";

export const updateEmailSettings = async (req, res) => {
  try {
    const {
      email,
      password,
      host,
      port,
      fromEmail,
      bccEmail,
      ccEmail,
      fromEmail1,
      bccEmail1,
      ccEmail1,
      careerTemplate,
      careerSubject,
      inquiryTemplate,
      inquirySubject,
      
    } = req.body;
    const findData = await emailSettingsSchema.findOne();
    if (findData) {
      let updatedData = {};
      updatedData["email"] = email;
      updatedData["password"] = password;
      updatedData["host"] = host;
      updatedData["port"] = port;
      updatedData["fromEmail"] = fromEmail;
      updatedData["fromEmail1"] = fromEmail1;
      updatedData["bccEmail"] = bccEmail;
      updatedData["bccEmail1"] = bccEmail1;
      updatedData["ccEmail"] = ccEmail;
      updatedData["ccEmail1"] = ccEmail1;
      updatedData["careerTemplate"] = careerTemplate;
      updatedData["inquiryTemplate"] = inquiryTemplate;
      updatedData["inquirySubject"] = inquirySubject;
      updatedData["careerSubject"] = careerSubject;
      await emailSettingsSchema
        .findByIdAndUpdate(findData.id, updatedData, { new: true })
        .then((setting) => {
          return res.status(200).send({
            data: setting,
            message: "Email settings updated successfully.",
            isSuccess: true,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            message: error.message,
            isSuccess: false,
          });
        });
    } else {
      const settingData = new emailSettingsSchema({
        email,
        password,
        host,
        port,
        fromEmail,
        bccEmail,
        ccEmail,
        fromEmail1,
        bccEmail1,
        ccEmail1,
        careerTemplate,
        inquiryTemplate,
        inquirySubject,
        careerSubject,
      });
      await settingData
        .save()
        .then((setting) => {
          return res.status(200).send({
            data: setting,
            message: "Email settings updated successfully.",
            isSuccess: true,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            message: error.message,
            isSuccess: false,
          });
        });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

export const getEmailSettings = async (req, res) => {
  await emailSettingsSchema
    .findOne()
    .then(async (data) => {
      return res.status(200).send({
        data: data,
        isSuccess: true,
        message: "Get data successfully.",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
        isSuccess: false,
      });
    });
};
