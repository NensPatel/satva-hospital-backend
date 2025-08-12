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
  getDataBySlug,
  getLastSrNo,
  updateDisorderSectionIsActive,
  updateDisorderSectionPosition,
  disorderSectionByDisorder

} from "../../controllers/admin/disorderSection.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createDisorderSection", verifyTokenAdmin, validateCreate, createDisorderSection);
router.put("/updateDisorderSection", verifyTokenAdmin, validateUpdate, updateDisorderSection);
router.post("/updateDisorderSectionIsActive/:id", verifyTokenAdmin, updateDisorderSectionIsActive);
router.put("/updateDisorderSectionPosition", verifyTokenAdmin, updateDisorderSectionPosition);
router.delete("/deleteDisorderSection", verifyTokenAdmin, deleteDisorderSection);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.get("/disorderSectionByDisorder/:disorder_id", verifyTokenAdmin, disorderSectionByDisorder);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllDisorderSections", getAllDisorderSections);
router.post("/getDataBySlug/:slug", getDataBySlug);


export default router;
