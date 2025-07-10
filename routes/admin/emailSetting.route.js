import express from "express";
import {
  updateEmailSettings,
  getEmailSettings,
} from "../../controllers/admin/emailSetting.controller.js";
import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { emailSettingsValidator } from "../../validation/admin/emailSetting.validation.js";

const router = express.Router();

router.post("/updateEmailSettings", verifyTokenAdmin, emailSettingsValidator, updateEmailSettings);
router.get("/getEmailSettings", getEmailSettings);

export default router;
