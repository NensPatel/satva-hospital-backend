import Joi from "joi";
import mongoose from "mongoose";

// Helper to check for valid ObjectId
const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid disorder_id");
  }
  return value;
};

export const validateCreate = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
   content: Joi.string().allow("").optional(),
    sort_order_no: Joi.number().required(),
    disorder_id: Joi.string().custom(isValidObjectId).required(),
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
    disorderSection_id: Joi.string().custom(isValidObjectId).required(),
    title: Joi.string().min(2).max(100).required(),
   content: Joi.string().allow("").optional(),
    sort_order_no: Joi.number().required(),
    disorder_id: Joi.string().custom(isValidObjectId).required(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
  next();
};
