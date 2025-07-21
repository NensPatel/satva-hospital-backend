import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/patientReview.validation.js";

import {
  createPatientReview,
  updatePatientReview,
  deletePatientReview,
  getPaginationData,
  getDataById,
  getAllPatientReview,
  getLastSrNo,
  updatePatientReviewIsActive
} from "../../controllers/admin/patientReviews.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createPatientReview", verifyTokenAdmin, validateCreate, createPatientReview);
router.put("/updatePatientReview", verifyTokenAdmin, validateUpdate, updatePatientReview);
router.get("/updatePatientReviewIsActive/:id", verifyTokenAdmin, updatePatientReviewIsActive);
router.delete("/deletePatientReview", verifyTokenAdmin, deletePatientReview);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllPatientReview", getAllPatientReview);

export default router;

