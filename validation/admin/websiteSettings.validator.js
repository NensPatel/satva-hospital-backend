import Joi from "joi";

export const websiteSettingsValidator = async (req, res, next) => {
  const schema = Joi.object({
    hospitalName: Joi.string().allow("").required().label("Hospital Name"),
    slogan: Joi.string().allow("").required().label("Slogan"),
    description: Joi.string().allow("").required().label("Description"),
    email1: Joi.string().email().allow("").required().label("Primary Email"),
    email2: Joi.string().email().allow("").required().label("Secondary Email"),
    contact1: Joi.string()
      .pattern(/^\d{7,15}$/)
      .allow("")
      .required()
      .label("Contact Number 1"),
    contact2: Joi.string()
      .pattern(/^\d{7,15}$/)
      .allow("")
      .required()
      .label("Contact Number 2"),
    address: Joi.string().allow("").required().label("Address"),
    mapLink: Joi.string().uri().allow("").required().label("Map Link"),
    social_media: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().allow("").required().label("Social Media Name"),
          link: Joi.string().uri().allow("").required().label("Social Media Link"),
        })
      )
      .required()
      .label("Social Media"),  
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).send({
      message: error.details.map((d) => d.message).join(", "),
      isSuccess: false,
    });
  }
  next();
};
