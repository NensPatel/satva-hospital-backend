import Joi from "joi";

const socialMediaSchema = Joi.array().items(
  Joi.object({
    name: Joi.string().required(),
    link: Joi.string().uri().required(),
  })
);

export const validateCreate = async (req, res, next) => {
  try {
    if (typeof req.body.socialMedia === "string") {
      req.body.socialMedia = JSON.parse(req.body.socialMedia);
    }
  } catch (e) {
    return res.status(400).json({
      message: "Invalid JSON in socialMedia field",
      isSuccess: false,
    });
  }

  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    slug: Joi.string().allow("").optional(),
    name: Joi.string().required(),
    designation: Joi.string().required(),
    socialMedia: socialMediaSchema.optional(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message).join(", "),
      isSuccess: false,
    });
  }
  next();
};

export const validateUpdate = async (req, res, next) => {
  try {
    if (typeof req.body.socialMedia === "string") {
      req.body.socialMedia = JSON.parse(req.body.socialMedia);
    }
  } catch (e) {
    return res.status(400).json({
      message: "Invalid JSON in socialMedia field",
      isSuccess: false,
    });
  }

  const schema = Joi.object({
    doctor_id: Joi.string().length(24).required(),
    sort_order_no: Joi.number().required(),
    slug: Joi.string().allow("").optional(),
    name: Joi.string().required(),
    designation: Joi.string().required(),
    socialMedia: socialMediaSchema.optional(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message).join(", "),
      isSuccess: false,
    });
  }
  next();
};
