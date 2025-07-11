import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/doctorDetails.validation.js";

import {
  createDoctorDetails,
  updateDoctorDetails,
  deleteDoctorDetails,
  getPaginationData,
  getDataById,
  getAllDoctorDetails,
  getLastSrNo,
} from "../../controllers/admin/doctorDetails.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createDoctorDetails", verifyTokenAdmin, validateCreate, createDoctorDetails);
router.post("/updateDoctorDetails", verifyTokenAdmin, validateUpdate, updateDoctorDetails);
router.post("/deleteDoctorDetails", verifyTokenAdmin, deleteDoctorDetails);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllDoctorDetails", getAllDoctorDetails);

export default router;
