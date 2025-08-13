import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    contactNo: Joi.string().length(10).pattern(/^\d+$/).required().messages({
      "string.empty": "Contact number is required",
      "string.length": "Contact number must be exactly 10 digits",
      "string.pattern.base": "Contact number must contain only numbers",
    }),

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
