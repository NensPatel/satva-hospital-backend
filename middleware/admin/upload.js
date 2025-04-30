import multer from "multer";
import path from "path";
import fs from "fs";

const createModelStorage = (modelType) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, `../../public/${modelType}`);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      const storedPath = `public/${modelType}/${filename}`;

      // store single image
      if (file.fieldname === "image") {
        req.body.image = storedPath;
      }

      // store multiple images as object
      if (file.fieldname === "images") {
        if (!req.body.images) {
          req.body.images = [];
        }
        req.body.images.push({ storedPath });
        console.log(req.body.images);
      }

      // store document
      if (file.fieldname === "document") {
        req.body.document = storedPath;
      }

      // store image and document both
      if (file.fieldname === "image" && file.fieldname === "document") {
        req.body.document = storedPath;
      }

      cb(null, filename);
    },
  });
};

const imgFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp|svg|gif/;
  const extname = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimeType = fileTypes.test(file.mimeType);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb("Only images are allowed (jpeg, jpg, png, gif)!", false);
  }
};

const docFilter = (req, file, cb) => {
    const fileTypes = /pdf|doc|docx/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
  
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb("Only documents are allowed (pdf, doc, docx)!", false);
    }
}

const imgAndDocFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|webp|svg|gif/;
  const pdfTypes = /pdf|doc|docx/;
  const extname =
    imageTypes.test(path.extname(file.originalname).toLowerCase()) ||
    pdfTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    imageTypes.test(file.mimetype) || pdfTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      "Only images and documents are allowed (jpeg, jpg, png, gif, pdf, doc, docx)!",
      false
    );
  }
}

const uploadSlider = multer({
  storage: createModelStorage("slider"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
});

module.exports = {
  uploadSlider: uploadSlider.single("image"),
};