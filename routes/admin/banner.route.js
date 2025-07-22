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
  updateBannerIsActive
} from "../../controllers/admin/banner.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadBanner } from "../../middleware/admin/upload.js";

router.post("/createBanner", verifyTokenAdmin, uploadBanner, validateCreate, createBanner);
router.put("/updateBanner", verifyTokenAdmin, uploadBanner, validateUpdate, updateBanner);
router.get("/updateBannerIsActive/:id", verifyTokenAdmin, updateBannerIsActive);
router.delete("/deleteBanner", verifyTokenAdmin, deleteBanner);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllBanners", getAllBanners);

export default router;
