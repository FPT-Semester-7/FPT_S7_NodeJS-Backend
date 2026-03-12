/**
 * @file MCProfile.js
 * @description Schema chi tiết cho hồ sơ năng lực của MC.
 */

const mongoose = require("mongoose");

const mcProfileSchema = new mongoose.Schema(
  {
    // Liên kết bản ghi với User tương ứng
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Các khu vực hoạt động (VD: Hà Nội, TP.HCM, ...)
    regions: {
      type: [String],
      default: [],
    },
    // Số năm kinh nghiệm
    experience: {
      type: Number,
      default: 0,
    },
    // Các phong cách dẫn chương trình (VD: Vui vẻ, Trang trọng, ...)
    styles: {
      type: [String],
      default: [],
    },
    biography: {
      type: String,
      default: "",
    },
    personality: {
      type: String,
      default: "",
    },
    hostingStyle: {
      type: String,
      default: "",
    },
    notableEvents: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    // Khoảng giá tham khảo (Cát-xê)
    rates: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    // Các loại sự kiện nhận dẫn (VD: Đám cưới, Hội thảo, Gala, ...)
    eventTypes: {
      type: [String],
      default: [],
    },
    // Trạng thái hiện tại
    status: {
      type: String,
      enum: ["Available", "Busy"],
      default: "Available",
    },
    // Danh sách các sản phẩm demo (Ảnh hoặc Video)
    showreels: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], required: true },
      },
    ],
    audioSamples: {
      type: [String],
      default: [],
    },
    eventPhotos: {
      type: [String],
      default: [],
    },
    customPackages: [
      {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        price: { type: Number, default: 0 },
      },
    ],
    // Điểm đánh giá trung bình
    rating: {
      type: Number,
      default: 0,
    },
    // Tổng số lượt đánh giá
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MCProfile", mcProfileSchema);
