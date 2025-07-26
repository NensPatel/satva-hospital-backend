import Joi from "joi";

export const emailSettingsValidator = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().allow("").required(),
    password: Joi.string().allow("").required(),
    host: Joi.string().allow("").required(),
    port: Joi.number().allow("").required(),
    fromEmail: Joi.string().allow("").optional(),
    bccEmail: Joi.string().allow("").optional(),
    ccEmail: Joi.string().allow("").optional(),
    fromEmail1: Joi.string().allow("").optional(),
    bccEmail1: Joi.string().allow("").optional(),
    ccEmail1: Joi.string().allow("").optional(),
    inquiryTemplate: Joi.string().allow("").optional(),
    careerTemplate: Joi.string().allow("").optional(),
    inquirySubject: Joi.string().allow("").optional(),
    careerSubject: Joi.string().allow("").optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  }
  next();
};
