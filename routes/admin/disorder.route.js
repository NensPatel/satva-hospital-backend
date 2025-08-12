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
  listDisordersBySpeciality,
  updateDisorderIsActive,
  updateDisorderPosition,
  getDataBySlug,
} from "../../controllers/admin/disorder.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post(
  "/createDisorder",
  verifyTokenAdmin,
  validateCreate,
  createDisorder
);
router.put("/updateDisorder", verifyTokenAdmin, validateUpdate, updateDisorder);
router.post(
  "/updateDisorderIsActive/:id",
  verifyTokenAdmin,
  updateDisorderIsActive
);
router.delete("/deleteDisorder", verifyTokenAdmin, deleteDisorder);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getDataBySlug/:slug", verifyTokenAdmin, getDataBySlug);
router.get(
  "/listDisordersBySpeciality/:speciality_id",
  listDisordersBySpeciality
);
router.put("/updateDisorderPosition", verifyTokenAdmin, updateDisorderPosition);

router.post("/getAllDisorders", getAllDisorders);

export default router;
