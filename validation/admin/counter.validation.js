import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    label: Joi.string().min(2).max(50).required(),
    count: Joi.string().required(),
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
    counter_id: Joi.string().length(24).required(),
    sort_order_no: Joi.number().required(),
    label: Joi.string().min(2).max(50).required(),
    count: Joi.string().required(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};
