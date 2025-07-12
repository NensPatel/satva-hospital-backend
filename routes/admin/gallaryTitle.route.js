import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/gallaryTitle.validation.js";

import {
  createGallaryTitle,
  updateGallaryTitle,
  deleteGallaryTitle,
  getPaginationData,
  getDataById,
  getAllGallaryTitle,
  getLastSrNo,
} from "../../controllers/admin/gallaryTitle.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createGallaryTitle", verifyTokenAdmin, validateCreate, createGallaryTitle);
router.post("/updateGallaryTitle", verifyTokenAdmin, validateUpdate, updateGallaryTitle);
router.post("/deleteGallaryTitle", verifyTokenAdmin, deleteGallaryTitle);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllGallaryTitle", getAllGallaryTitle);

export default router;
