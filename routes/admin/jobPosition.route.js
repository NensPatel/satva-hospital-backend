import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/jobPosition.validation.js";

import {
  createJobPosition,
  updateJobPosition,
  deleteJobPosition,
  getPaginationData,
  getDataById,
  getAllJobPositions,
  getLastSrNo,
  updateJobPositionIsActive
} from "../../controllers/admin/jobPosition.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadJobPosition } from "../../middleware/admin/upload.js";

router.post("/createJobPosition", verifyTokenAdmin, uploadJobPosition, validateCreate, createJobPosition);
router.put("/updateJobPosition", verifyTokenAdmin, uploadJobPosition, validateUpdate, updateJobPosition);
router.get("/updateJobPositionIsActive/:id", verifyTokenAdmin, updateJobPositionIsActive);
router.delete("/deleteJobPosition", verifyTokenAdmin, deleteJobPosition);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllJobPositions", getAllJobPositions);

export default router;
