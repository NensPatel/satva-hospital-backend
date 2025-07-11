import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/feature.validation.js";

import {
  createFeature,
  updateFeature,
  deleteFeature,
  getPaginationData,
  getDataById,
  getAllFeature,
  getLastSrNo,
} from "../../controllers/admin/feature.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadFeatures } from "../../middleware/admin/upload.js";

router.post("/createFeature", verifyTokenAdmin, uploadFeatures, validateCreate, createFeature);
router.post("/updateFeature", verifyTokenAdmin, uploadFeatures, validateUpdate, updateFeature);
router.post("/deleteFeature", verifyTokenAdmin, deleteFeature);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllFeature", getAllFeature);

export default router;
