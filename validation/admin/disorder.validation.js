import Joi from "joi";
import mongoose from "mongoose";

// Helper to check for valid ObjectId
const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid speciality_id");
  }
  return value;
};

export const validateCreate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string().lowercase().trim().required(),
    sort_order_no: Joi.number().required(),
    speciality_id: Joi.string().custom(isValidObjectId).required(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
  next();
};

export const validateUpdate = (req, res, next) => {
  const schema = Joi.object({
    disorder_id: Joi.string().custom(isValidObjectId).required(),
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string().lowercase().trim().required(),
    sort_order_no: Joi.number().required(),
    speciality_id: Joi.string().custom(isValidObjectId).required(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
  next();
};
