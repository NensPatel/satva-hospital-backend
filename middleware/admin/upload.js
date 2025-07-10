import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage engine generator
const createModelStorage = (modelType) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir = path.join(__dirname, `../../public/${modelType}`);
      // For speciality, use subfolders for image and banner
      if (modelType === "speciality") {
        if (file.fieldname === "image") {
          uploadDir = path.join(uploadDir, "image");
        } else if (file.fieldname === "banner") {
          uploadDir = path.join(uploadDir, "banner");
        }
      }
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      let storedPath = `public/${modelType}/${filename}`;
      if (modelType === "speciality") {
        if (file.fieldname === "image") {
          storedPath = `public/${modelType}/image/${filename}`;
        } else if (file.fieldname === "banner") {
          storedPath = `public/${modelType}/banner/${filename}`;
        }
      }

      // Optionally attach to req.body for later use
      if (file.fieldname === "image") {
        req.body.image = storedPath;
      }
      if (file.fieldname === "banner") {
        req.body.banner = storedPath;
      }
      if (file.fieldname === "images") {
        req.body.images = req.body.images || [];
        req.body.images.push({ storedPath });
      }
      if (file.fieldname === "document") {
        req.body.document = storedPath;
      }

      cb(null, filename);
    },
  });
};

// Image filter
const imgFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp|svg|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif, etc.)"), false);
  }
};

// Document filter
const docFilter = (req, file, cb) => {
  const fileTypes = /pdf|doc|docx/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only documents are allowed (pdf, doc, docx)"), false);
  }
};

// Combined image & document filter
const imgAndDocFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|webp|svg|gif/;
  const docTypes = /pdf|doc|docx/;
  const extname =
    imageTypes.test(path.extname(file.originalname).toLowerCase()) ||
    docTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    imageTypes.test(file.mimetype) || docTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images and documents are allowed!"), false);
  }
};

// Uploaders
const uploadSlider = multer({
  storage: createModelStorage("slider"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imgFilter,
});


const uploadDocuments = multer({
  storage: createModelStorage("documents"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: docFilter,
});

const uploadCounter = multer({
  storage: createModelStorage("counter"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any();


const uploadCoreServices = multer({
  storage: createModelStorage("coreServices"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any();

const uploadCashlessFacility = multer({
  storage: createModelStorage("cashlessFacility"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any();

const uploadHealthInfo = multer({
  storage: createModelStorage("healthInfo"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any(); 

const uploadSpeciality = multer({
  storage: createModelStorage("speciality"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).fields([
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]);


// Exports
export {
  uploadSlider,
  uploadCounter,
  uploadCoreServices,
  uploadSpeciality,
  uploadCashlessFacility,
  uploadHealthInfo,
  uploadDocuments,
  imgFilter,
  docFilter,
  imgAndDocFilter,
  createModelStorage,
};
