import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/gallaryImage.validation.js";

import {
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getPaginationData,
  getDataById,
  getAllGalleryImages,
  getLastSrNo,
  updateGallaryImageIsActive,
  updateGallaryImagePosition,
  getImageByGalleryCategory,
  getLastSrNoByGalleryCategory
} from "../../controllers/admin/gallaryImage.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uplaodGallery } from "../../middleware/admin/upload.js";

router.post("/createGalleryImage", verifyTokenAdmin, uplaodGallery, validateCreate, createGalleryImage);
router.put("/updateGalleryImage", verifyTokenAdmin, uplaodGallery, validateUpdate, updateGalleryImage);
router.post("/updateGallaryImageIsActive/:id", verifyTokenAdmin, updateGallaryImageIsActive);
router.put("/updateGallaryImagePosition", verifyTokenAdmin, updateGallaryImagePosition);
router.delete("/deleteGalleryImage", verifyTokenAdmin, deleteGalleryImage);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.get("/getImageByGalleryCategory/:galleryCategoryId", verifyTokenAdmin, getImageByGalleryCategory);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.get("/getLastSrNoByGalleryCategory/:galleryCategoryId", verifyTokenAdmin, getLastSrNoByGalleryCategory);

router.post("/getAllGalleryImages", getAllGalleryImages);

export default router;

