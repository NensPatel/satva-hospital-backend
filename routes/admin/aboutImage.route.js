import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/aboutImage.validation.js";

import {
  createAboutImage,
  updateAboutImage,
  deleteAboutImage,
  getPaginationData,
  getDataById,
  getAllAboutImage,
  getLastSrNo,
  updateAboutIsActive
} from "../../controllers/admin/aboutUsImage.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadAboutUs } from "../../middleware/admin/upload.js";

router.post("/createAboutImage", verifyTokenAdmin, uploadAboutUs, validateCreate, createAboutImage);
router.put("/updateAboutImage", verifyTokenAdmin, uploadAboutUs, validateUpdate, updateAboutImage);
router.get("/updateAboutIsActive/:id", verifyTokenAdmin, updateAboutIsActive);
router.delete("/deleteAboutImage", verifyTokenAdmin, deleteAboutImage);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllAboutImage", getAllAboutImage);

export default router;

