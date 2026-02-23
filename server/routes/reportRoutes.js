import express from "express";
import { getAdminReport } from "../controllers/reportController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { downloadReportPDF } from "../controllers/reportController.js";

const router = express.Router();

router.get("/admin-report", isAuthenticated, isAuthorized("Admin"), getAdminReport);
router.get(
  "/download-pdf",
  isAuthenticated,
  isAuthorized("Admin"),
  downloadReportPDF
);

export default router;