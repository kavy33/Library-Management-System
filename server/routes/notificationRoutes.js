import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  getMyNotifications,
  markNotificationAsRead 
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/my", isAuthenticated, getMyNotifications);
router.put("/read-all", isAuthenticated, markNotificationAsRead);

export default router;