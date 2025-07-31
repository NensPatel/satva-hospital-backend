import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    tabs: Joi.array().items(
      Joi.object({
        sort_order_no: Joi.number().required(),
        title: Joi.string().min(2).max(100).required(),
        content: Joi.string().required(),
        isActive: Joi.boolean().optional()
      })
    ).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details.map(d => d.message).join(", "), isSuccess: false });
  }
  next();
};


export const validateUpdate = async (req, res, next) => {
  const schema = Joi.object({
    about_id: Joi.string().length(24).required(),
    tabs: Joi.array().items(
      Joi.object({
        sort_order_no: Joi.number().required(),
        title: Joi.string().min(2).max(100).required(),
        content: Joi.string().required(),
        isActive: Joi.boolean().optional()
      })
    ).optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details.map(d => d.message).join(", "), isSuccess: false });
  }
  next();
};
