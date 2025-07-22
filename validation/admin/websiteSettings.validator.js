import Joi from "joi";

export const websiteSettingsValidator = async (req, res, next) => {
  const schema = Joi.object({
    companyName: Joi.string().allow("").required(),
    cin: Joi.string().allow("").required(),
    email: Joi.string().email().allow("").required(),
    contact1: Joi.string().pattern(/^\d{7,15}$/).allow("").required(),
    contact2: Joi.string().pattern(/^\d{7,15}$/).allow("").required(),
    address1: Joi.string().allow("").required(),
    address2: Joi.string().allow("").required(),
    mapLink: Joi.string().uri().allow("").required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  }
  next();
};
