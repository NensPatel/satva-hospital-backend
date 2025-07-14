import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    menuType: Joi.string().min(2).max(50).required(),
    menuName: Joi.string().min(2).max(100).required(),
    menuURL: Joi.string().min(2).max(200).required(),
    metaTitle: Joi.string().min(2).max(100).required(),
    metakeyword: Joi.string().min(2).max(100).required(),
    metaDescription: Joi.string().min(2).max(200).required(),
    parentId: Joi.string().min(24).max(24).allow(null),
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
    menu_id: Joi.string().min(24).max(24).required(),
    sort_order_no: Joi.number().required(),
    menuType: Joi.string().min(2).max(50).required(),
    menuName: Joi.string().min(2).max(100).required(),
    menuURL: Joi.string().min(2).max(200).required(),
    metaTitle: Joi.string().min(2).max(100).required(),
    metakeyword: Joi.string().min(2).max(100).required(),
    metaDescription: Joi.string().min(2).max(200).required(),
    parentId: Joi.string().min(24).max(24).allow(null),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};
