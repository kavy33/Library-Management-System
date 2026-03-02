import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  getMyNotifications,
  markNotificationAsRead
} from "../controllers/notificationController.js";

const router = express.Router();

// 🔔 GET MY NOTIFICATIONS
router.get("/my", isAuthenticated, getMyNotifications);

// 🔔 MARK AS READ
router.put("/read/:notificationId", isAuthenticated, markNotificationAsRead);

export default router;