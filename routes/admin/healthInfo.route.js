import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/healthInfo.validation.js";

import {
  createHealthInfo,
  updateHealthInfo,
  deleteHealthInfo,
  getPaginationData,
  getDataById,
  getAllHealthInfo,
  getLastSrNo,
} from "../../controllers/admin/healthInfo.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadHealthInfo } from "../../middleware/admin/upload.js";

router.post("/createHealthInfo", verifyTokenAdmin, uploadHealthInfo, validateCreate, createHealthInfo);
router.post("/updateHealthInfo", verifyTokenAdmin, uploadHealthInfo, validateUpdate, updateHealthInfo);
router.post("/deleteHealthInfo", verifyTokenAdmin, deleteHealthInfo);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllHealthInfo", getAllHealthInfo);

export default router;
