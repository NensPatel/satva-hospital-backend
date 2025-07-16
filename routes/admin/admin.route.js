import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
} from "../../controllers/admin/admin.controller.js";
import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";
import { validateCreate } from "../../validation/admin/admin.validation.js";

const router = express.Router();

// Public routes
router.post("/register", validateCreate, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);


// Protected routes
router.get("/profile", verifyTokenAdmin, getProfile);
router.put("/update-profile", verifyTokenAdmin, updateProfile);
router.post("/change-password", verifyTokenAdmin, changePassword);

export default router;
