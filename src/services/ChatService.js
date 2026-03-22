const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

class ChatService {
  /**
   * Create a conversation linked to a booking (called automatically by BookingService)
   * Does NOT create duplicate if one already exists for this booking.
   */
  async createConversationForBooking(bookingId, clientId, mcId) {
    // Check if conversation already exists for this booking
    let conversation = await Conversation.findOne({ bookingId });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [clientId, mcId],
        bookingId,
        isActive: true,
      });
    }

    return conversation;
  }

  /**
   * Deactivate conversation when booking is rejected
   */
  async deactivateByBookingId(bookingId) {
    return Conversation.findOneAndUpdate(
      { bookingId },
      { isActive: false },
      { new: true },
    );
  }

  /**
   * Get all conversations for a user
   */
  async getConversations(userId) {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name avatar role")
      .populate("lastMessage")
      .populate("bookingId", "eventName eventDate status")
      .sort({ updatedAt: -1 });

    return conversations;
  }

  /**
   * Get paginated messages for a conversation
   */
  async getMessages(conversationId, userId, page = 1, limit = 50) {
    // Verify user is a participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      Message.find({ conversationId })
        .populate("senderId", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments({ conversationId }),
    ]);

    // Mark messages as read by current user
    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        readBy: { $nin: [userId] },
      },
      { $addToSet: { readBy: userId } },
    );

    return {
      messages: messages.reverse(), // Return in chronological order
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Send a message — enforces isActive check
   */
  async sendMessage(conversationId, senderId, content, type = "text") {
    // Verify user is a participant AND conversation is active
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId,
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    if (!conversation.isActive) {
      throw new Error(
        "This conversation is no longer active. The booking was rejected.",
      );
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content,
      type,
      readBy: [senderId], // Sender has read their own message
    });

    // Update conversation's lastMessage and updatedAt
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    // Populate sender info before returning
    const populated = await Message.findById(message._id).populate(
      "senderId",
      "name avatar",
    );

    return { message: populated, conversation };
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId, userId) {
    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        readBy: { $nin: [userId] },
      },
      { $addToSet: { readBy: userId } },
    );
  }
}

module.exports = new ChatService();
