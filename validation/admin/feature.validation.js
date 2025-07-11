import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};

export const validateUpdate = async (req, res, next) => {
  const schema = Joi.object({
    feature_id: Joi.string().length(24).required(),
    sort_order_no: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};
