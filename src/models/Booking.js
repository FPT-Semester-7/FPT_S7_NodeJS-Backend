/**
 * @file Booking.js
 * @description Schema quản lý thông tin đặt lịch dẫn chương trình (Booking).
 */

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // ID người dùng đặt lịch (Khách hàng)
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ID của MC được đặt lịch
    mc: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Ngày diễn ra sự kiện
    eventDate: { type: Date, required: true },
    // Tên sự kiện
    eventName: { type: String, required: true },
    // Giờ bắt đầu và kết thúc theo giờ địa phương
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    // Địa điểm tổ chức
    location: { type: String, required: true },
    // Loại hình sự kiện
    eventType: { type: String, required: true },
    // Mô tả và yêu cầu bổ sung từ khách hàng
    description: { type: String },
    audienceSize: { type: Number, default: 0 },
    budget: { type: Number, required: true },
    specialRequests: { type: String },
    // Tổng giá trị giao dịch
    price: { type: Number, required: true },
    // Trạng thái đơn đặt lịch
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Cancelled", "Rejected"],
      default: "Pending",
    },
    // Trạng thái thanh toán
    paymentStatus: {
      type: String,
      enum: ["Pending", "DepositPaid", "FullyPaid", "Refunded"],
      default: "Pending",
    },
    decidedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
