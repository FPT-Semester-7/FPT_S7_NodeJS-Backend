const chatService = require("../services/ChatService");
const notificationService = require("../services/NotificationService");

exports.getConversations = async (req, res) => {
  try {
    const conversations = await chatService.getConversations(req.user.id);
    res.status(200).json({
      status: "success",
      results: conversations.length,
      data: { conversations },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await chatService.getMessages(
      req.params.id,
      req.user.id,
      page,
      limit,
    );

    // Emit read event so sender sees read receipts
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation_${req.params.id}`).emit("messages_read", {
        conversationId: req.params.id,
        userId: req.user.id,
      });
    }

    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content, type } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ status: "fail", message: "Content is required" });
    }

    const { message, conversation } = await chatService.sendMessage(
      req.params.id,
      req.user.id,
      content,
      type || "text",
    );

    // Emit via socket.io to conversation room
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation_${req.params.id}`).emit("new_message", message);

      // Send notification to recipient(s) who are not the sender
      const recipients = conversation.participants.filter(
        (p) => p.toString() !== req.user.id,
      );
      for (const recipientId of recipients) {
        await notificationService.create(
          {
            user: recipientId,
            senderId: req.user.id,
            title: "New Message",
            body: content.substring(0, 100),
            type: "message_received",
            relatedId: conversation._id,
            relatedModel: "Conversation",
            linkAction: `/m/messaging`,
          },
          io,
        );
      }
    }

    res.status(201).json({ status: "success", data: { message } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await chatService.markMessagesAsRead(req.params.id, req.user.id);

    // Emit read event via socket
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation_${req.params.id}`).emit("messages_read", {
        conversationId: req.params.id,
        userId: req.user.id,
      });
    }

    res
      .status(200)
      .json({ status: "success", message: "Messages marked as read" });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
