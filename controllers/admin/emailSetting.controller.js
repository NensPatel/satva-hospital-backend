import emailSettingsSchema from "../../models/admin/emailsetting.model.js";

export const updateEmailSettings = async (req, res) => {
  try {
    const {
      email,
      password,
      host,
      port,
      fromEmailInquiry,
      bccEmailInquiry,
      ccEmailInquiry,
      inquiryTemplate,
      inquirySubject,
      fromEmailCareer,
      bccEmailCareer,
      ccEmailCareer,
      careerTemplate,
      careerSubject,
      fromEmailBlood,
      bccEmailBlood,
      ccEmailBlood,
      bloodDonateTemplate,
      bloodDonateSubject,
      fromEmailAppointment,
      bccEmailAppointment,
      ccEmailAppointment,
      appointmentTemplate,
      appointmentSubject,
      fromEmailCallback,
      bccEmailCallback,
      ccEmailCallback,
      callbackSubject,
      callbackTemplate,
    } = req.body;
    const findData = await emailSettingsSchema.findOne();
    if (findData) {
      let updatedData = {};
      updatedData["email"] = email;
      updatedData["password"] = password;
      updatedData["host"] = host;
      updatedData["port"] = port;
      updatedData["fromEmailInquiry"] = fromEmailInquiry;
      updatedData["bccEmailInquiry"] = bccEmailInquiry;
      updatedData["ccEmailInquiry"] = ccEmailInquiry;
      updatedData["inquiryTemplate"] = inquiryTemplate;
      updatedData["inquirySubject"] = inquirySubject;
      updatedData["fromEmailCareer"] = fromEmailCareer;
      updatedData["bccEmailCareer"] = bccEmailCareer;
      updatedData["ccEmailCareer"] = ccEmailCareer;
      updatedData["careerTemplate"] = careerTemplate;
      updatedData["careerSubject"] = careerSubject;
      updatedData["fromEmailBlood"] = fromEmailBlood;
      updatedData["bccEmailBlood"] = bccEmailBlood;
      updatedData["ccEmailBlood"] = ccEmailBlood;
      updatedData["bloodDonateTemplate"] = bloodDonateTemplate;
      updatedData["bloodDonateSubject"] = bloodDonateSubject;
      updatedData["fromEmailAppointment"] = fromEmailAppointment;
      updatedData["bccEmailAppointment"] = bccEmailAppointment;
      updatedData["ccEmailAppointment"] = ccEmailAppointment;
      updatedData["appointmentTemplate"] = appointmentTemplate;
      updatedData["appointmentSubject"] = appointmentSubject;
      updatedData["fromEmailCallback"] = fromEmailCallback;
      updatedData["bccEmailCallback"] = bccEmailCallback;
      updatedData["ccEmailCallback"] = ccEmailCallback;
      updatedData["callbackTemplate"] = callbackTemplate;
      updatedData["callbackSubject"] = callbackSubject;

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
        fromEmailInquiry,
        bccEmailInquiry,
        ccEmailInquiry,
        inquiryTemplate,
        inquirySubject,
        fromEmailCareer,
        bccEmailCareer,
        ccEmailCareer,
        careerTemplate,
        careerSubject,
        fromEmailBlood,
        bccEmailBlood,
        ccEmailBlood,
        bloodDonateTemplate,
        bloodDonateSubject,
        fromEmailAppointment,
        bccEmailAppointment,
        ccEmailAppointment,
        appointmentTemplate,
        appointmentSubject,
        fromEmailCallback,
        bccEmailCallback,
        ccEmailCallback,
        callbackSubject,
        callbackTemplate,

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
