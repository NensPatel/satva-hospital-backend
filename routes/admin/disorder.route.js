import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/disorder.validation.js";

import {
  createDisorder,
  updateDisorder,
  deleteDisorder,
  getPaginationData,
  getDataById,
  getAllDisorders,
  getLastSrNo,
} from "../../controllers/admin/disorder.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createDisorder", verifyTokenAdmin, validateCreate, createDisorder);
router.post("/updateDisorder", verifyTokenAdmin, validateUpdate, updateDisorder);
router.post("/deleteDisorder", verifyTokenAdmin, deleteDisorder);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllDisorders", getAllDisorders);

export default router;
