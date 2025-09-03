import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(2).required().messages({
      "string.empty": "Full name is required",
      "string.min": "Full name must be at least 2 characters",
    }),
    dob: Joi.date().less("now").required().messages({
      "date.base": "Date of birth must be a valid date",
      "date.less": "Date of birth cannot be in the future",
      "any.required": "Date of birth is required",
    }),
    phone: Joi.string().length(10).pattern(/^\d+$/).required().messages({
      "string.empty": "Contact number is required",
      "string.length": "Contact number must be exactly 10 digits",
      "string.pattern.base": "Contact number must contain only numbers",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
    currentDesignation: Joi.string().min(2).allow("").optional(),
    currentOrganization: Joi.string().min(2).allow("").optional(),
    currentLocation: Joi.string().min(2).required().messages({
      "string.empty": "Current location is required",
      "string.min": "Current location must be at least 2 characters",
    }),
    yearsOfExperience: Joi.number().min(0).allow(null, "").messages({
      "number.base": "Years of experience must be a number",
      "number.min": "Years of experience cannot be negative",
    }),
    currentCTC: Joi.number().min(0).allow(null, "").messages({
      "number.base": "Current CTC must be a number",
      "number.min": "Current CTC cannot be negative",
    }),
    additionalInfo: Joi.string().allow("").optional(),
    position: Joi.string().required().messages({
      "string.empty": "Position is required",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: error.details[0].message, isSuccess: false });
  }

  next();
};
