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

  if (modelType === "banner") {
    if (file.fieldname === "desktopImage") {
      uploadDir = path.join(uploadDir, "desktop");
    } else if (file.fieldname === "mobileImage") {
      uploadDir = path.join(uploadDir, "mobile");
    }
  }

 if (modelType === "websiteSetting") {
    if (file.fieldname === "headerLogo") {
      uploadDir = path.join(uploadDir, "header");
    } else if (file.fieldname === "footerLogo") {
      uploadDir = path.join(uploadDir, "footer");
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

        if (modelType === "banner") {
        if (file.fieldname === "desktopImage") {
          storedPath = `public/${modelType}/desktop/${filename}`;
        } else if (file.fieldname === "mobileImage") {
          storedPath = `public/${modelType}/mobile/${filename}`;
        }
      }

       if (modelType === "websiteSetting") {
  if (file.fieldname === "headerLogo") {
    storedPath = `public/${modelType}/header/${filename}`;
  } else if (file.fieldname === "footerLogo") {
    storedPath = `public/${modelType}/footer/${filename}`;
  }
}


      // Optionally attach to req.body for later use
      if (file.fieldname === "headerLogo") {
        req.body.headerLogo = storedPath;
      }
      if (file.fieldname === "footerLogo") {
        req.body.footerLogo = storedPath;
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

const videoFilter = (req, file, cb) => {
   const fileTypes = /mp4|mov|avi/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only videos are allowed (mp4, mov, avi, etc.)"), false);
  }
}
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
    cb(new Error("Only images,Videos and documents are allowed!"), false);
  }
};

const imgAndVideoFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|webp|svg|gif/;
  const videoTypes = /mp4|mov|avi/;
  const extname =
    imageTypes.test(path.extname(file.originalname).toLowerCase()) ||
    videoTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    imageTypes.test(file.mimetype) || videoTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false);
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

const uploadFeatures = multer({
  storage: createModelStorage("features"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any();

const uploadOurTeam = multer({
  storage: createModelStorage("ourTeam"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any();

const uplaodGallery = multer({
  storage: createModelStorage("gallery"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any();

const uploadTieUp = multer({
  storage: createModelStorage("tieUp"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any();

const uploadAboutUs = multer({
  storage: createModelStorage("aboutUs"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any();

const uploadMissionVisions = multer({
  storage: createModelStorage("missionVision"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any();

const uploadSpeciality = multer({
  storage: createModelStorage("speciality"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgFilter,
}).any(); 

  const uploadBanner = multer({
  storage: createModelStorage("banner"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgAndVideoFilter,
}).fields([
  { name: "desktopImage", maxCount: 1 },
  { name: "mobileImage", maxCount: 1 },
]);

const uploadWebsiteSetting = multer({
  storage: createModelStorage("websiteSetting"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imgAndDocFilter,
}).fields([
  { name: "headerLogo", maxCount: 1 },
  { name: "footerLogo", maxCount: 1 },
]);

const uploadCareer = multer({
  storage: createModelStorage("career"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: docFilter,
}).any();

// Exports
export {
  uploadSlider,
  uploadCounter,
  uploadCoreServices,
  uploadSpeciality,
  uploadCashlessFacility,
  uploadHealthInfo,
  uploadFeatures,
  uploadOurTeam,
  uplaodGallery,
  uploadTieUp,
  uploadAboutUs,
  uploadMissionVisions,
  uploadBanner,
  uploadWebsiteSetting,
  uploadCareer,
  uploadDocuments,
  imgFilter,
  docFilter,
  videoFilter,
  imgAndDocFilter,
  imgAndVideoFilter,
  createModelStorage,
};
