import Joi from "joi";

export const emailSettingsValidator = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().allow("").required(),
    password: Joi.string().allow("").required(),
    host: Joi.string().allow("").required(),
    port: Joi.number().allow("").required(),
    fromEmailInquiry: Joi.string().required(),
    bccEmailInquiry: Joi.string().allow("").optional(),
    ccEmailInquiry: Joi.string().allow("").optional(),
    inquiryTemplate: Joi.string().allow("").optional(),
    inquirySubject: Joi.string().allow("").optional(),
    fromEmailCareer: Joi.string().required(),
    bccEmailCareer: Joi.string().allow("").optional(),
    ccEmailCareer: Joi.string().allow("").optional(),
    careerTemplate: Joi.string().allow("").optional(),
    careerSubject: Joi.string().allow("").optional(),
    fromEmailBlood: Joi.string().required(),
    bccEmailBlood: Joi.string().allow("").optional(),
    ccEmailBlood: Joi.string().allow("").optional(),
    bloodDonateTemplate: Joi.string().allow("").optional(),
    bloodDonateSubject: Joi.string().allow("").optional(),
    fromEmailAppointment: Joi.string().required(),
    bccEmailAppointment: Joi.string().allow("").optional(),
    ccEmailAppointment: Joi.string().allow("").optional(),
    appointmentTemplate: Joi.string().allow("").optional(),
    appointmentSubject: Joi.string().allow("").optional(),
    fromEmailCallback: Joi.string().required(),
    bccEmailCallback: Joi.string().allow("").optional(),
    ccEmailCallback: Joi.string().allow("").optional(),
    callbackSubject: Joi.string().allow("").optional(),
    callbackTemplate: Joi.string().allow("").optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  }
  next();
};
