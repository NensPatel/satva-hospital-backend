import express from "express";
const router = express.Router();

import {
  validateCreate
} from "../../validation/admin/bloodDonation.validation.js";


import {
  createBloodDonation,
  deleteBloodDonation,
  getPaginationData,
  getDataById,
  getAllBloodDonations
} from "../../controllers/admin/bloodDonation.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadBloodDonationProof } from "../../middleware/admin/upload.js";

router.post("/createBloodDonation",  uploadBloodDonationProof, validateCreate, createBloodDonation);
router.delete("/deleteBloodDonation", verifyTokenAdmin, deleteBloodDonation);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getAllBloodDonations", getAllBloodDonations);

export default router;

