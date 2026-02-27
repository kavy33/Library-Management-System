import { getMonthlyRevenue, getMostFinedUsers, getPaymentAnalytics, getRefundStats, getRevenueByCategory, getTopPayingUsers } from "../controllers/adminAnalyticsController.js";
import { isAuthenticated,isAuthorized } from "../middlewares/authMiddleware.js";
import express from "express";
const router = express.Router();

router.get("/payment-analytics",isAuthenticated,isAuthorized("Admin"),getPaymentAnalytics);

router.get("/analytics/monthly", isAuthenticated, isAuthorized("Admin"), getMonthlyRevenue);
router.get("/analytics/category", isAuthenticated, isAuthorized("Admin"), getRevenueByCategory);
router.get("/analytics/top-users", isAuthenticated, isAuthorized("Admin"), getTopPayingUsers);
router.get("/analytics/top-fines", isAuthenticated, isAuthorized("Admin"), getMostFinedUsers);
router.get("/analytics/refunds", isAuthenticated, isAuthorized("Admin"), getRefundStats);

export default router;