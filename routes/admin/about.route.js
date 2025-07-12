import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/aboutUs.validation.js";

import {
  createAbout,
  updateAbout,
  deleteAbout,
  getPaginationData,
  getDataById,
  getAllAbout,
  getLastSrNo,
} from "../../controllers/admin/aboutUs.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadAboutUs } from "../../middleware/admin/upload.js";

router.post("/createAbout", verifyTokenAdmin, uploadAboutUs, validateCreate, createAbout);
router.post("/updateAbout", verifyTokenAdmin, uploadAboutUs, validateUpdate, updateAbout);
router.post("/deleteAbout", verifyTokenAdmin, deleteAbout);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllAbout", getAllAbout);

export default router;

