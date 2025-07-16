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
  updateHealthInfoIsActive
} from "../../controllers/admin/healthInfo.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadHealthInfo } from "../../middleware/admin/upload.js";

router.post("/createHealthInfo", verifyTokenAdmin, uploadHealthInfo, validateCreate, createHealthInfo);
router.put("/updateHealthInfo", verifyTokenAdmin, uploadHealthInfo, validateUpdate, updateHealthInfo);
router.get('/updateHealthInfoIsActive/:id', verifyTokenAdmin, updateHealthInfoIsActive);
router.delete("/deleteHealthInfo", verifyTokenAdmin, deleteHealthInfo);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.get("/getAllHealthInfo", getAllHealthInfo);

export default router;
