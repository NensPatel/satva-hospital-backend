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
  updateCounterIsActive
} from "../../controllers/admin/counter.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadCounter } from "../../middleware/admin/upload.js";

router.post("/createCounters", verifyTokenAdmin, uploadCounter, validateCreate, createCounters);
router.put("/updateCounters", verifyTokenAdmin, uploadCounter, validateUpdate, updateCounters);
router.get("/updateCounterIsActive/:id", verifyTokenAdmin, updateCounterIsActive);
router.delete("/deleteCounters", verifyTokenAdmin, deleteCounters);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllCounters", getAllCounters);

export default router;
