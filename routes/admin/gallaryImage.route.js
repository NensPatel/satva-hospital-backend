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
} from "../../controllers/admin/gallaryImage.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uplaodGallery } from "../../middleware/admin/upload.js";

router.post("/createGalleryImage", verifyTokenAdmin, uplaodGallery, validateCreate, createGalleryImage);
router.post("/updateGalleryImage", verifyTokenAdmin, uplaodGallery, validateUpdate, updateGalleryImage);
router.post("/deleteGalleryImage", verifyTokenAdmin, deleteGalleryImage);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllGalleryImages", getAllGalleryImages);

export default router;
