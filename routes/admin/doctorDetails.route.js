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
  updateDoctorDetailsIsActive,
  updateDoctorDetailsPosition,
  doctorDetailsByDoctor
} from "../../controllers/admin/doctorDetails.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createDoctorDetails", verifyTokenAdmin, validateCreate, createDoctorDetails);
router.put("/updateDoctorDetails", verifyTokenAdmin, validateUpdate, updateDoctorDetails);
router.post("/updateDoctorDetailsIsActive/:id", verifyTokenAdmin, updateDoctorDetailsIsActive);
router.put("/updateDoctorDetailsPosition", verifyTokenAdmin, updateDoctorDetailsPosition);
router.delete("/deleteDoctorDetails", verifyTokenAdmin, deleteDoctorDetails);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.get("/doctorDetailsByDoctor/:doctor_id", verifyTokenAdmin, doctorDetailsByDoctor);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllDoctorDetails", getAllDoctorDetails);

export default router;
