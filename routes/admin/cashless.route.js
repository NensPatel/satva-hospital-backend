import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/cashless.validation.js";

import {
  createCashlessFacility,
  updateCashlessFacility,
  deleteCashlessFacility,
  getPaginationData,
  getDataById,
  getAllCashlessFacility,
  getLastSrNo,
  updateCashlessFacilitiesIsActive
} from "../../controllers/admin/cashlessF.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadCashlessFacility } from "../../middleware/admin/upload.js";

router.post("/createCashlessFacility", verifyTokenAdmin, uploadCashlessFacility, validateCreate, createCashlessFacility);
router.put("/updateCashlessFacility", verifyTokenAdmin, uploadCashlessFacility, validateUpdate, updateCashlessFacility);
router.get("/updateCashlessFacilitiesIsActive/:id", verifyTokenAdmin, updateCashlessFacilitiesIsActive);
router.delete("/deleteCashlessFacility", verifyTokenAdmin, deleteCashlessFacility);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllCashlessFacility", getAllCashlessFacility);

export default router;

