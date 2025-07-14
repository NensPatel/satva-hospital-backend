import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/menu.validation.js";  

import {
  createMenu,
  updateMenu,
  deleteMenu,
  getPaginationData,
  getPaginationParentData,
  getDataById,
  getAllMenu,
  getLastSrNo,
  getLastParentSrNo,
} from "../../controllers/admin/menu.controller.js";
import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createMenu", verifyTokenAdmin, validateCreate, createMenu);
router.post("/updateMenu", verifyTokenAdmin, validateUpdate, updateMenu);
router.post("/deleteMenu", verifyTokenAdmin, deleteMenu);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post(
  "/getPaginationParentData",
  verifyTokenAdmin,
  getPaginationParentData
);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getLastParentSrNo", verifyTokenAdmin, getLastParentSrNo);

router.post("/getAllMenu", getAllMenu);

export default router;
