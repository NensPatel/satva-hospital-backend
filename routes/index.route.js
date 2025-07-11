import express from "express";
import adminRoute from "./admin/admin.route.js";        
import emailSettingRoute from "./admin/emailSetting.route.js";
import counterRoute from "./admin/counter.route.js";
import coreServicesRoute from "./admin/coreServices.route.js";
import specialityRoute from "./admin/speciality.route.js";
import disorderRoute from "./admin/disorder.route.js";
import disorderSectionRoute from "./admin/disorderSection.route.js";
import cashlessRoute from "./admin/cashless.route.js";
import patientReviewRoute from "./admin/patientReview.route.js";
import healthInfoRoute from "./admin/healthInfo.route.js";
import featureRoute from "./admin/feature.route.js";
import ourTeamRoute from "./admin/ourTeam.route.js";
import doctorDetailsRoute from "./admin/doctorDetails.route.js";

const router = express.Router();

router.use("/admin", adminRoute);
router.use("/emailSetting", emailSettingRoute);
router.use("/counter", counterRoute);
router.use("/coreServices", coreServicesRoute);
router.use("/speciality", specialityRoute);
router.use("/disorder", disorderRoute);
router.use("/disorderSection", disorderSectionRoute);
router.use("/cashless", cashlessRoute);
router.use("/patientReview", patientReviewRoute);
router.use("/healthInfo", healthInfoRoute);
router.use("/feature", featureRoute);
router.use("/ourTeam", ourTeamRoute);
router.use("/doctorDetails", doctorDetailsRoute);

export default router;
