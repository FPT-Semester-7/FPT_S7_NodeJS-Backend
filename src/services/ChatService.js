const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Booking = require("../models/Booking");

const toIdString = (value) => (value ? value.toString() : null);

class ChatService {
  async addBookingSystemMarker(conversationId, bookingId) {
    const marker = await Message.create({
      conversationId,
      type: "system",
      content: `--- Booking mới #${bookingId} bắt đầu ---`,
      bookingId,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      bookingId,
      isActive: true,
      lastMessage: marker._id,
      updatedAt: new Date(),
    });

    return marker;
  }

  async resolveLatestBookingForParticipants(participants = []) {
    if (!Array.isArray(participants) || participants.length < 2) {
      return null;
    }

    const [first, second] = participants;
    const userA = first && (first._id || first);
    const userB = second && (second._id || second);
    if (!userA || !userB) {
      return null;
    }

    return Booking.findOne({
      $or: [
        { client: userA, mc: userB },
        { client: userB, mc: userA },
      ],
    })
      .sort({ createdAt: -1 })
      .select("eventName eventDate status")
      .lean();
  }

  async enrichConversation(conversationDoc) {
    const conversation = conversationDoc.toObject
      ? conversationDoc.toObject()
      : conversationDoc;

    const populatedCurrent =
      conversation.bookingId && typeof conversation.bookingId === "object"
        ? conversation.bookingId
        : null;

    const fallbackCurrent = populatedCurrent
      ? null
      : await this.resolveLatestBookingForParticipants(
          conversation.participants,
        );

    const currentBooking = populatedCurrent || fallbackCurrent || null;
    const currentBookingId = currentBooking
      ? toIdString(currentBooking._id || currentBooking.id)
      : conversation.bookingId
        ? toIdString(conversation.bookingId)
        : null;

    return {
      ...conversation,
      currentBookingId,
      currentBooking,
    };
  }

  /**
   * Create or reuse 1-1 conversation for a booking.
   * If a conversation between client and MC already exists, reuse it and add a system marker.
   */
  async createConversationForBooking(bookingId, clientId, mcId) {
    let conversation = await Conversation.findOne({
      participants: { $all: [clientId, mcId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [clientId, mcId],
        bookingId,
        isActive: true,
      });
    }

    await this.addBookingSystemMarker(conversation._id, bookingId);

    return Conversation.findById(conversation._id)
      .populate("participants", "name avatar role")
      .populate("lastMessage")
      .populate("bookingId", "eventName eventDate status");
  }

  /**
   * Deactivate conversation when booking is rejected
   */
  async deactivateByBookingId(bookingId) {
    return Conversation.findOneAndUpdate(
      { bookingId: bookingId.toString() },
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

    return Promise.all(
      conversations.map((conversation) =>
        this.enrichConversation(conversation),
      ),
    );
  }

  async getConversationById(conversationId, userId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    })
      .populate("participants", "name avatar role")
      .populate("lastMessage")
      .populate("bookingId", "eventName eventDate status");

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    return this.enrichConversation(conversation);
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
