import { User } from "../models/userModel.js";

// ======================================
// 🔔 GET USER NOTIFICATIONS
// ======================================

export const getMyNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
     const unreadCount = user.notifications.filter(n => !n.isRead).length;

    res.status(200).json({
      success: true,
      notifications: user.notifications.reverse(),
        unreadCount,
      
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

    user.notifications.forEach(n => {
    n.isRead = true;
  });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read"
    });

  } catch (error) {
    next(error);
  }
};