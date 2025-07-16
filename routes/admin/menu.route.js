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
  getPaginationMenus,
  getPaginationParentData,
  getDataById,
  getAllMenu,
  getLastSrNo,
  updateMenuIsActive,
  updateMenuPosition,
  getMenuWithoutPagination,
  getMenusByParentId
} from "../../controllers/admin/menu.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

// Create
router.post("/createMenu", verifyTokenAdmin, validateCreate, createMenu);

// Update
router.put("/updateMenu", verifyTokenAdmin, validateUpdate, updateMenu);

// Toggle isActive
router.get('/updateMenuIsActive/:id', verifyTokenAdmin, updateMenuIsActive);

// Change position
router.put('/updateMenuPosition', verifyTokenAdmin, updateMenuPosition);

// Delete
router.delete("/deleteMenu", verifyTokenAdmin, deleteMenu);

// Fetch menus
router.get("/getMenuWithoutPagination", getMenuWithoutPagination);
router.post("/getPaginationMenus", verifyTokenAdmin, getPaginationMenus);
router.post("/getPaginationParentData", verifyTokenAdmin, getPaginationParentData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getmenus",getMenusByParentId)

// All menus
router.get("/getAllMenu", getAllMenu);

export default router;
