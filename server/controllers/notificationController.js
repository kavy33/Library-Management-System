import { User } from "../models/userModel.js";

// ======================================
// 🔔 GET USER NOTIFICATIONS
// ======================================

export const getMyNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("notifications");

    res.status(200).json({
      success: true,
      notifications: user.notifications.sort(
        (a, b) => b.createdAt - a.createdAt
      )
    });

  } catch (error) {
    next(error);
  }
};

// ======================================
// 🔔 MARK AS READ
// ======================================

export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const user = await User.findById(req.user._id);

    const notification = user.notifications.id(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read"
    });

  } catch (error) {
    next(error);
  }
};