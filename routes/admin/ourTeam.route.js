import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/ourTeam.validation.js";

import {
  createTeam,
  updateTeam,
  deleteTeam,
  getPaginationData,
  getDataById,
  getAllTeam,
  getLastSrNo,
} from "../../controllers/admin/ourTeam.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadOurTeam } from "../../middleware/admin/upload.js";

router.post("/createTeam", verifyTokenAdmin, uploadOurTeam, validateCreate, createTeam);
router.post("/updateTeam", verifyTokenAdmin, uploadOurTeam, validateUpdate, updateTeam);
router.post("/deleteTeam", verifyTokenAdmin, deleteTeam);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllTeam", getAllTeam);

export default router;
