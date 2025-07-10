import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/speciality.validation.js";

import {
  createSpeciality,
  updateSpeciality,
  deleteSpeciality,
  getPaginationData,
  getDataById,
  getAllSpeciality,
  getLastSrNo,
} from "../../controllers/admin/speciality.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadSpeciality } from "../../middleware/admin/upload.js";

router.post("/createSpeciality", verifyTokenAdmin, uploadSpeciality, validateCreate, createSpeciality);
router.post("/updateSpeciality", verifyTokenAdmin, uploadSpeciality, validateUpdate, updateSpeciality);
router.post("/deleteSpeciality", verifyTokenAdmin, deleteSpeciality);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllSpeciality", getAllSpeciality);

export default router;
