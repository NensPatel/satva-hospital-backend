import Joi from "joi";

// Validate create
export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    position: Joi.number().required(),
    menuName: Joi.string().min(2).max(100).required(),
    menuUrl: Joi.string().required(),
    metaTitle: Joi.string().min(2).max(100).required(),
    metaKeywords: Joi.string().min(2).max(100).required(),
    metaDescription: Joi.string().min(2).max(200).required(),
    parentId: Joi.string().length(24).allow(null, '').optional(),
    showInHeader: Joi.boolean().optional(),
    showInFooter: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};

// Validate update
export const validateUpdate = async (req, res, next) => {
  const schema = Joi.object({
    menu_id: Joi.string().length(24).required(),
    position: Joi.number().required(),
    menuName: Joi.string().min(2).max(100).required(),
    menuUrl: Joi.string().required(),
    metaTitle: Joi.string().min(2).max(100).required(),
    metaKeywords: Joi.string().min(2).max(100).required(),
    metaDescription: Joi.string().min(2).max(200).required(),
    parentId: Joi.string().length(24).allow(null, '').optional(),
    showInHeader: Joi.boolean().optional(),
    showInFooter: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};
