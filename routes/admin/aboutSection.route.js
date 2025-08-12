import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/aboutSection.validation.js";

import {
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
  getPaginationData,
  getDataById,
  getAllAboutSection,
  getLastSrNo,
  updateAboutIsActive,
} from "../../controllers/admin/aboutSection.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadAboutSection } from "../../middleware/admin/upload.js";

router.post(
  "/createAboutSection",
  verifyTokenAdmin,
  uploadAboutSection,
  validateCreate,
  createAboutSection
);
router.post(
  "/updateAboutSection",
  verifyTokenAdmin,
  uploadAboutSection,
  validateUpdate,
  updateAboutSection
);
router.post("/deleteAboutSection", verifyTokenAdmin, deleteAboutSection);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/updateAboutIsActive/:id", verifyTokenAdmin, updateAboutIsActive);
router.post("/getAllAboutSection", getAllAboutSection);

export default router;
