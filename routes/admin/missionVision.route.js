import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/missionVision.validation.js";

import {
  createMissionVision,
  updateMissionVision,
  deleteMissionVision,
  getPaginationData,
  getDataById,
  getAllMissionVision,
  getLastSrNo,
  updateMissionVisionIsActive
} from "../../controllers/admin/missionVision.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadMissionVisions } from "../../middleware/admin/upload.js";

router.post("/createMissionVision", verifyTokenAdmin, uploadMissionVisions, validateCreate, createMissionVision);
router.put("/updateMissionVision", verifyTokenAdmin, uploadMissionVisions, validateUpdate, updateMissionVision);
router.get("/updateMissionVisionIsActive/:id", verifyTokenAdmin, updateMissionVisionIsActive);
router.delete("/deleteMissionVision", verifyTokenAdmin, deleteMissionVision);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllMissionVision", getAllMissionVision);

export default router;
