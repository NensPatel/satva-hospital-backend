import express from "express";
const router = express.Router();

import {
  validateCreate
} from "../../validation/admin/inquiry.validation.js";

import {
  createInquiry,
  deleteInquiry,
  getPaginationData,
  getDataById,
  getAllInquiry
} from "../../controllers/admin/inquiry.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createInquiry", verifyTokenAdmin, validateCreate, createInquiry);
router.post("/deleteInquiry", verifyTokenAdmin, deleteInquiry);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getAllInquiry", getAllInquiry);

export default router;

