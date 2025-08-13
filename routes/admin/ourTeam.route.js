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
  updateTeamIsActive,
  getDataBySlug,
  updateDoctorPosition
} from "../../controllers/admin/ourTeam.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadOurTeam } from "../../middleware/admin/upload.js";

router.post("/createTeam", verifyTokenAdmin, uploadOurTeam, validateCreate, createTeam);
router.put("/updateTeam", verifyTokenAdmin, uploadOurTeam, validateUpdate, updateTeam);
router.get("/updateTeamIsActive/:id", verifyTokenAdmin, updateTeamIsActive);
router.delete("/deleteTeam", verifyTokenAdmin, deleteTeam);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getDataBySlug/:slug", verifyTokenAdmin, getDataBySlug);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.put("/updateDoctorPosition", verifyTokenAdmin, updateDoctorPosition);
router.post("/getAllTeam", getAllTeam);

export default router;
