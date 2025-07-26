import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/tieUpImage.validation.js";

import {
  createTieUpImage,
  updateTieUpImage,
  deleteTieUpImage,
  getPaginationData,
  getDataById,
  getAllTieUpImage,
  getLastSrNo,
  updateTieUpImageIsActive,
  updateTieUpImagePosition,
  getImageByTieUpId
} from "../../controllers/admin/tieUpImage.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uploadTieUp } from "../../middleware/admin/upload.js";

router.post("/createTieUpImage", verifyTokenAdmin, uploadTieUp, validateCreate, createTieUpImage);
router.put("/updateTieUpImage", verifyTokenAdmin, uploadTieUp, validateUpdate, updateTieUpImage);
router.post("/updateTieUpImageIsActive/:id", verifyTokenAdmin, updateTieUpImageIsActive);
router.put("/updateTieUpImagePosition", verifyTokenAdmin, updateTieUpImagePosition);
router.delete("/deleteTieUpImage", verifyTokenAdmin, deleteTieUpImage);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.get("/getImageByTieUpId/:tieUp_id", verifyTokenAdmin, getImageByTieUpId);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllTieUpImage", getAllTieUpImage);

export default router;

