import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    contactNo: Joi.string()
      .pattern(/^\d{10}$/)
      .required(),
    experience: Joi.string().required(),
    subject: Joi.string().required(),
    message: Joi.string().allow("").optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};
