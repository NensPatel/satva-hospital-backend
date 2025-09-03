import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    doctor: Joi.string().required(),
    fullName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(10).required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    message: Joi.string().allow("").optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};
