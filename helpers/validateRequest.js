import { convertToUrlPath } from "./common.js";

const validateRequest = (schema, deleteImage) => (req, res, next) => {
  console.log(req.files);

  if (req.body?.images && Array.isArray(req.body?.images)) {
    req.body.images = req.body.images.map((image) => ({
      storedPath: image.storedPath,
    }));
  }

  if (req.files && req.files.images && Array.isArray(req.files.images)) {
   req.body.images = req.files.images.map((image) => ({
     storedPath: convertToUrlPath(image.filename),
   }));
  } 

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    if (req.body.images && req.body.images.length > 0) {
      req.body.images.foreEach((image) => deleteImage(image.storedPath));
    } else if (req.body.image) {
      deleteImage(req.body.image);
    }

    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({
      isSucess: false,
      message: errorMessage,
    });
  }
  next();
};

module.exports = validateRequest;
