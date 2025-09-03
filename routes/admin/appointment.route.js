import express from "express";
const router = express.Router();

import {
  validateCreate
} from "../../validation/admin/appointment.validation.js";

import {
  createAppointment,
  deleteAppointment,
  getPaginationData,
  getDataById,
  getAllAppointment
} from "../../controllers/admin/appointment.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createAppointment",  validateCreate, createAppointment);
router.delete("/deleteAppointment", verifyTokenAdmin, deleteAppointment);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getAllAppointment", getAllAppointment);

export default router;

