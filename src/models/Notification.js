const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "booking_request",
        "booking_confirmed",
        "booking_cancelled",
        "payment_escrowed",
        "payment_released",
        "new_review",
        "message_received",
        "system",
      ],
      default: "system",
    },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    relatedModel: { type: String },
    linkAction: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Index for efficient queries by user and sorting
notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
