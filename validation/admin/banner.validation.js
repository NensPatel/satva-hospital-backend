import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    menuId: Joi.string().min(24).max(24).required(),
    bannerType: Joi.string().valid("image", "video").required(),
    bannerTitle: Joi.string().min(2).max(50).allow("").optional(),
    bannerLink: Joi.string().allow("").optional(),
    description: Joi.string().min(2).max(500).allow("").optional(),
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
    banner_id: Joi.string().required(),
    sort_order_no: Joi.number().required(),
    menuId: Joi.string().min(24).max(24).required(),
    bannerType: Joi.string().valid("image", "video").required(),
    bannerTitle: Joi.string().min(2).max(50).allow("").optional(),
    bannerLink: Joi.string().allow("").optional(),
    description: Joi.string().min(2).max(500).allow("").optional(),
    isActive: Joi.boolean().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};

