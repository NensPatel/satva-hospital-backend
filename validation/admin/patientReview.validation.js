import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    patient_name: Joi.string().required(),
    content: Joi.string().allow("").optional(),
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
    review_id: Joi.string().length(24).required(),
    sort_order_no: Joi.number().required(),
    patient_name: Joi.string().min(2).max(50).required(),
    content: Joi.string().allow("").optional(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};
