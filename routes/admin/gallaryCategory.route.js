import express from "express";
const router = express.Router();

import {
  validateCreate,
  validateUpdate,
} from "../../validation/admin/gallaryCategory.validation.js";

import {
  createGallaryCategory,
  updateGallaryCategory,
  deleteGallaryCategory,
  getPaginationData,
  getDataById,
  getAllCategories,
  getLastSrNo,
  getDataBySlug,
  listCategoriesByTitle,
  updateCategoryIsActive,
  updateCategoryPosition,
  getLastSrNoByGallaryTitle,
} from "../../controllers/admin/gallaryCategory.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { uplaodGallery } from "../../middleware/admin/upload.js";

router.post(
  "/createGallaryCategory",
  verifyTokenAdmin,
  uplaodGallery,
  validateCreate,
  createGallaryCategory
);
router.put(
  "/updateGallaryCategory",
  verifyTokenAdmin,
  uplaodGallery,
  validateUpdate,
  updateGallaryCategory
);
router.delete(
  "/deleteGallaryCategory",
  verifyTokenAdmin,
  deleteGallaryCategory
);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getDataBySlug/:slug", getDataBySlug);

router.get(
  "/updateCategoryIsActive/:id",
  verifyTokenAdmin,
  updateCategoryIsActive
);
router.put("/updateCategoryPosition", verifyTokenAdmin, updateCategoryPosition);
router.get(
  "/listCategoriesByTitle/:gallaryTitleId",
  verifyTokenAdmin,
  listCategoriesByTitle
);
router.get(
  "/getLastSrNoByGallaryTitle/:gallaryTitleId",
  verifyTokenAdmin,
  getLastSrNoByGallaryTitle
);

router.post("/getAllCategories", getAllCategories);

export default router;
