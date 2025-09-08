import express from "express";
const router = express.Router();

import {
  validateCreate
} from "../../validation/admin/callback.validation.js";

import {
  createCallback,
  deleteCallback,
  getPaginationData,
  getDataById,
  getAllCallback
} from "../../controllers/admin/callback.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createCallback",  validateCreate, createCallback);
router.delete("/deleteCallback", verifyTokenAdmin, deleteCallback);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getAllCallback", getAllCallback);

export default router;

