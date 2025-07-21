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
  updateFeatureIsActive
} from "../../controllers/admin/feature.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadFeatures } from "../../middleware/admin/upload.js";

router.post("/createFeature", verifyTokenAdmin, uploadFeatures, validateCreate, createFeature);
router.put("/updateFeature", verifyTokenAdmin, uploadFeatures, validateUpdate, updateFeature);
router.get("/updateFeatureIsActive/:id", verifyTokenAdmin, updateFeatureIsActive);
router.delete("/deleteFeature", verifyTokenAdmin, deleteFeature);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllFeature", getAllFeature);

export default router;
