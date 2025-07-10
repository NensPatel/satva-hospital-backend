import Joi from "joi";

export const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    
    fullname: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  }
  next();
};

export const validateUpdate = async (req, res, next) => {
  const schema = Joi.object({
    admin_id: Joi.string().length(24), // MongoDB _id
    fullname: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  }
  next();
};

export const updateStatus = async (req, res, next) => {
  const schema = Joi.object({
    isActive: Joi.boolean().required(),
    modelName: Joi.string().required(),
    fieldId: Joi.string().length(24),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  }
  next();
};
