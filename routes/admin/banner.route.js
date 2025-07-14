import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/banner.validation.js";

import {
  createBanner,
  updateBanner,
  deleteBanner,
  getPaginationData,
  getDataById,
  getAllBanners,
  getLastSrNo,
} from "../../controllers/admin/banner.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadBanner } from "../../middleware/admin/upload.js";

router.post("/createBanner", verifyTokenAdmin, uploadBanner, validateCreate, createBanner);
router.post("/updateBanner", verifyTokenAdmin, uploadBanner, validateUpdate, updateBanner);
router.post("/deleteBanner", verifyTokenAdmin, deleteBanner);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllBanners", getAllBanners);

export default router;
