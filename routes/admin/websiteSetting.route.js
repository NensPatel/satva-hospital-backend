import express from "express";
import {
  createOrUpdateWebsiteSetting,
  getWebsiteSetting,
} from "../../controllers/admin/websiteSetting.controller.js";
import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { websiteSettingsValidator } from "../../validation/admin/websiteSettings.validator.js";
import { uploadWebsiteSetting } from "../../middleware/admin/upload.js";

const router = express.Router();

router.put("/createOrUpdateWebsiteSetting", verifyTokenAdmin, websiteSettingsValidator, uploadWebsiteSetting, createOrUpdateWebsiteSetting);
router.get("/getWebsiteSetting", getWebsiteSetting);

export default router;
