const notificationService = require("../services/NotificationService");

exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await notificationService.getByUserId(
      req.user.id,
      page,
      limit,
    );
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.status(200).json({ status: "success", data: { count } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.id,
    );
    if (!notification) {
      return res
        .status(404)
        .json({ status: "fail", message: "Notification not found" });
    }
    res.status(200).json({ status: "success", data: { notification } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res
      .status(200)
      .json({ status: "success", message: "All notifications marked as read" });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await notificationService.deleteOne(
      req.params.id,
      req.user.id,
    );
    if (!notification) {
      return res
        .status(404)
        .json({ status: "fail", message: "Notification not found" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await notificationService.deleteAll(req.user.id);
    res
      .status(200)
      .json({ status: "success", message: "All notifications cleared" });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
