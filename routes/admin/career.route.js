import express from "express";
const router = express.Router();

import {
  validateCreate
} from "../../validation/admin/career.validation.js";

import {
  createCareer,
  deleteCareer,
  getPaginationData,
  getDataById,
  getAllCareer
} from "../../controllers/admin/career.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadCareer } from "../../middleware/admin/upload.js";

router.post("/createCareer",  uploadCareer, validateCreate, createCareer);
router.delete("/deleteCareer", verifyTokenAdmin, deleteCareer);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getAllCareer", getAllCareer);

export default router;

