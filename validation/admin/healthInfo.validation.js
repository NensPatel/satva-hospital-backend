import Joi from "joi";

// Create validation
export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    slug: Joi.string().allow("").optional(),
    title: Joi.string().min(3).max(150).required(),
    short_desc: Joi.string().allow("").optional(),
    content: Joi.string().allow("").optional(),
    author: Joi.string().allow("").optional(),
    publishedAt: Joi.date().iso().optional(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details[0].message, isSuccess: false });
  }
  next();
};

// Update validation
export const validateUpdate = async (req, res, next) => {
  const schema = Joi.object({
    info_id: Joi.string().length(24).required(),
    sort_order_no: Joi.number().required(),
    slug: Joi.string().allow("").optional(),
    title: Joi.string().min(3).max(150).required(),
    short_desc: Joi.string().allow("").optional(),
    content: Joi.string().allow("").optional(),
    author: Joi.string().allow("").optional(),
    publishedAt: Joi.date().iso().optional(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details[0].message, isSuccess: false });
  }
  next();
};
