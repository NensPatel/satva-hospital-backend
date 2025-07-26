import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/tieUpTitle.validation.js";

import {
  createTieUpTitle,
  updateTieUpTitle,
  deleteTieUpTitle,
  getPaginationData,
  getDataById,
  getAllTieUpTitle,
  getLastSrNo,
  updateTieUpIsActive
} from "../../controllers/admin/tieUpTitle.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.get("/updateTieUpIsActive/:id", verifyTokenAdmin, updateTieUpIsActive);
router.post("/createTieUpTitle", verifyTokenAdmin, validateCreate, createTieUpTitle);
router.put("/updateTieUpTitle", verifyTokenAdmin, validateUpdate, updateTieUpTitle);
router.delete("/deleteTieUpTitle", verifyTokenAdmin, deleteTieUpTitle);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllTieUpTitle", getAllTieUpTitle);

export default router;
