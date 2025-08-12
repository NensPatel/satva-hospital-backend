import express from "express";
const router = express.Router();

import {
  createCoreFacilities,
  updateCoreFacilities,
  deleteCoreFacilities,
  getPaginationData,
  getDataById,
  getAllCoreFacilities,
  getLastSrNo,
  updateCoreFacilitiesIsActive,
} from "../../controllers/admin/coreFacilities.controller.js";

import { verifyTokenAdmin } from "../../middleware/admin/admin.auth.js";

router.post("/createCoreFacilities", verifyTokenAdmin, createCoreFacilities);
router.put("/updateCoreFacilities", verifyTokenAdmin, updateCoreFacilities);
router.get(
  "/updateCoreFacilitiesIsActive/:id",
  verifyTokenAdmin,
  updateCoreFacilitiesIsActive
);
router.delete("/deleteCoreFacilities", verifyTokenAdmin, deleteCoreFacilities);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllCoreFacilities", getAllCoreFacilities);

export default router;
