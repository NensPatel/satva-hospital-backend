import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/aboutTabs.validation.js";

import {
  createTabs,
  updateTabs,
  deleteTabs,
  getPaginationData,
  getDataById,
  getAllTabs,
  getLastSrNo,
  updateTabsIsActive,
  getTabsByAbout
} from "../../controllers/admin/aboutUsTabs.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/updateTabsIsActive/:id", verifyTokenAdmin, updateTabsIsActive);  
router.post("/createTabs", verifyTokenAdmin, validateCreate, createTabs);
router.put("/updateTabs", verifyTokenAdmin, validateUpdate, updateTabs);
router.delete("/deleteTabs", verifyTokenAdmin, deleteTabs);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.get("/getTabsByAbout/:about_id", verifyTokenAdmin, getTabsByAbout);
router.post("/getAllTabs", getAllTabs);

export default router;
