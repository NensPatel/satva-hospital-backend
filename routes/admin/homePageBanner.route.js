import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/homePageBanner.validation.js";

import {
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
  getPaginationData,
  getDataById,
  getAllHomeBanner,
  getLastSrNo,
  updateHomeBannerIsActive
} from "../../controllers/admin/homePageBanner.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadHomeBanner } from "../../middleware/admin/upload.js";

router.post("/createHomeBanner", verifyTokenAdmin, uploadHomeBanner, validateCreate, createHomeBanner);
router.put("/updateHomeBanner", verifyTokenAdmin, uploadHomeBanner, validateUpdate, updateHomeBanner);
router.get("/updateHomeBannerIsActive/:id", verifyTokenAdmin, updateHomeBannerIsActive);
router.delete("/deleteHomeBanner", verifyTokenAdmin, deleteHomeBanner);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllHomeBanner", getAllHomeBanner);

export default router;
