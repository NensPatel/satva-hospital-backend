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
  updateCoreServiceIsActive
} from "../../controllers/admin/coreServices.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadCoreServices } from "../../middleware/admin/upload.js";

router.post("/createCoreService", verifyTokenAdmin, uploadCoreServices, validateCreate, createCoreService);
router.put("/updateCoreService", verifyTokenAdmin, uploadCoreServices, validateUpdate, updateCoreService);
router.get("/updateCoreServiceIsActive/:id", verifyTokenAdmin, updateCoreServiceIsActive);
router.delete("/deleteCoreService", verifyTokenAdmin, deleteCoreService);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllCoreServices", getAllCoreServices);

export default router;
