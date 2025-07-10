import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/counter.validation.js";

import {
  createCounters,
  updateCounters,
  deleteCounters,
  getPaginationData,
  getDataById,
  getAllCounters,
  getLastSrNo,
} from "../../controllers/admin/counter.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadCounter } from "../../middleware/admin/upload.js";

router.post("/createCounters", verifyTokenAdmin, uploadCounter, validateCreate, createCounters);
router.post("/updateCounters", verifyTokenAdmin, uploadCounter, validateUpdate, updateCounters);
router.post("/deleteCounters", verifyTokenAdmin, deleteCounters);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllCounters", getAllCounters);

export default router;
