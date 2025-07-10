import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/disorderSection.validation.js";

import {
  createDisorderSection,
  updateDisorderSection,
  deleteDisorderSection,
  getPaginationData,
  getDataById,
  getAllDisorderSections,
  getLastSrNo,
} from "../../controllers/admin/disorderSection.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createDisorderSection", verifyTokenAdmin, validateCreate, createDisorderSection);
router.post("/updateDisorderSection", verifyTokenAdmin, validateUpdate, updateDisorderSection);
router.post("/deleteDisorderSection", verifyTokenAdmin, deleteDisorderSection);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllDisorderSections", getAllDisorderSections);

export default router;
