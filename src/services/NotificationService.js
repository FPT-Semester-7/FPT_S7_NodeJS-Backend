const Notification = require("../models/Notification");

class NotificationService {
  /**
   * Create a notification and optionally push via socket
   */
  async create(data, io) {
    const notification = await Notification.create(data);

    // Push real-time notification via socket
    if (io) {
      const populated = await Notification.findById(notification._id)
        .populate("senderId", "name avatar");
      io.to(`user_${data.user}`).emit("notification_push", populated);
    }

    return notification;
  }

  /**
   * Get paginated notifications for a user
   */
  async getByUserId(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      Notification.find({ user: userId })
        .populate("senderId", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ user: userId }),
    ]);

    return {
      notifications,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId) {
    return Notification.countDocuments({ user: userId, isRead: false });
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true },
    );
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    return Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true },
    );
  }

  /**
   * Delete a single notification
   */
  async deleteOne(notificationId, userId) {
    return Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });
  }

  /**
   * Clear all notifications for a user
   */
  async deleteAll(userId) {
    return Notification.deleteMany({ user: userId });
  }
}

module.exports = new NotificationService();
