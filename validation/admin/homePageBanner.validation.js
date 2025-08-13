import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    homeBannerType: Joi.string().valid("image", "video").required(),
    homeBannerTitle: Joi.string().min(2).max(50).allow("").optional(),
    homeBannerLink: Joi.string().allow("").optional(),
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
    home_banner_id: Joi.string().required(),
    sort_order_no: Joi.number().required(),
    homeBannerType: Joi.string().valid("image", "video").required(),
    homeBannerTitle: Joi.string().min(2).max(50).allow("").optional(),
    homeBannerLink: Joi.string().allow("").optional(),
    description: Joi.string().min(2).max(500).allow("").optional(),
    isActive: Joi.boolean().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};

