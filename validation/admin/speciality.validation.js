import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    title: Joi.string().min(2).max(50).required(),
    short_desc: Joi.string().allow("").optional(),
    full_desc: Joi.string().allow("").optional(),
    isActive: Joi.boolean().optional(),
    disorders: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string().allow("")
    ).optional()
  }).unknown(true); 

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }

  if (!req.files?.image?.length || !req.files?.banner?.length) {
    return res.status(400).json({
      message: "Both image and banner files are required.",
      isSuccess: false,
    });
  }
  next();
};



export const validateUpdate = async (req, res, next) => {
  const schema = Joi.object({
    speciality_id: Joi.string().length(24).required(),
    sort_order_no: Joi.number().required(),
    title: Joi.string().min(2).max(50).required(),
    short_desc: Joi.string().allow("").optional(),
    full_desc: Joi.string().allow("").optional(),
    isActive: Joi.boolean().optional(),
    disorders: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string().allow("")
    ).optional()
  }).unknown(true);

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};
