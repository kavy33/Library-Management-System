import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { getUserAnalytics } from "../controllers/userReportController.js";
import { downloadUserReport } from "../controllers/userReportDownloadController.js";

const router = express.Router();

router.get("/dashboard", isAuthenticated, getUserAnalytics);
router.get("/download", isAuthenticated, downloadUserReport);

export default router;