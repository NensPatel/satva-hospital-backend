import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/coreServices.validation.js";

import {
  createCoreService,
  updateCoreService,
  deleteCoreService,
  getPaginationData,
  getDataById,
  getAllCoreServices,
  getLastSrNo,
} from "../../controllers/admin/coreServices.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadCoreServices } from "../../middleware/admin/upload.js";

router.post("/createCoreService", verifyTokenAdmin, uploadCoreServices, validateCreate, createCoreService);
router.post("/updateCoreService", verifyTokenAdmin, uploadCoreServices, validateUpdate, updateCoreService);
router.post("/deleteCoreService", verifyTokenAdmin, deleteCoreService);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllCoreServices", getAllCoreServices);

export default router;
