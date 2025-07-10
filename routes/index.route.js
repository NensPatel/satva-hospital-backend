import express from "express";
import adminRoute from "./admin/admin.route.js";        
import emailSettingRoute from "./admin/emailSetting.route.js";
import counterRoute from "./admin/counter.route.js";
import coreServicesRoute from "./admin/coreServices.route.js";
import specialityRoute from "./admin/speciality.route.js";
import disorderRoute from "./admin/disorder.route.js";
import disorderSectionRoute from "./admin/disorderSection.route.js";
import cashlessRoute from "./admin/cashless.route.js";

const router = express.Router();

router.use("/admin", adminRoute);
router.use("/emailSetting", emailSettingRoute);
router.use("/counter", counterRoute);
router.use("/coreServices", coreServicesRoute);
router.use("/speciality", specialityRoute);
router.use("/disorder", disorderRoute);
router.use("/disorderSection", disorderSectionRoute);
router.use("/cashless", cashlessRoute);

export default router;
