import express from "express";
import { getAdminReport } from "../controllers/reportController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { downloadAdminReportPDF } from "../controllers/reportController.js";

const router = express.Router();

router.get("/admin-report", isAuthenticated, isAuthorized("Admin"), getAdminReport);
router.get("/download-pdf", downloadAdminReportPDF);

export default router;