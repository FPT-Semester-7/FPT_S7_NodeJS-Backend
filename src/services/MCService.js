/**
 * @file MCService.js
 * @description Lớp nghiệp vụ (Service) xử lý các chức năng dành riêng cho MC (Dashboard, Profile, Lịch làm việc, Ví tiền).
 */

const mcProfileRepository = require("../repositories/MCProfileRepository");
const bookingRepository = require("../repositories/BookingRepository");
const transactionRepository = require("../repositories/TransactionRepository");
const scheduleRepository = require("../repositories/ScheduleRepository");
const availabilityService = require("./AvailabilityService");
const mongoose = require("mongoose");
const User = require("../models/User");
const Review = require("../models/Review");
const Booking = require("../models/Booking");

const dashboardCache = new Map();

class MCService {
  async getDashboardStats(userId) {
    const [
      profile,
      totalBookings,
      walletStats,
      user,
      activeInquiries,
      ratingResult
    ] = await Promise.all([
      mcProfileRepository.findByUserId(userId),
      bookingRepository.countActiveByUserId(userId, "mc"),
      transactionRepository.getStats(userId),
      User.findById(userId),
      Booking.countDocuments({ mc: userId, status: "Pending" }),
      Review.aggregate([
        { $match: { mc: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }
      ])
    ]);

    let completionScore = 50;
    if (user?.phoneNumber) completionScore += 10;
    if (user?.bio) completionScore += 10;
    if (user?.avatar && user.avatar !== "default-avatar.png") completionScore += 10;
    if (profile?.price) completionScore += 20;

    const avgRating = ratingResult.length > 0 ? Number(ratingResult[0].avgRating.toFixed(1)) : 5.0;
    const totalReviews = ratingResult.length > 0 ? ratingResult[0].totalReviews : 0;

    const result = {
      profileStatus: profile ? profile.status : "Unavailable",
      completionPercentage: completionScore,
      stats: {
        totalBookings,
        activeInquiries: activeInquiries,
        avgRating,
        totalReviews,
        revenue: walletStats.totalRevenue,
        available: walletStats.available,
        escrow: walletStats.escrow,
      },
      isVerified: user ? user.isVerified : false,
    };

    return result;
  }

  // Cập nhật thông tin hồ sơ năng lực của MC
  async updateProfile(userId, data) {
    return await mcProfileRepository.updateByUserId(userId, data);
  }

  // Lấy lịch trình làm việc và các ngày bận
  async getCalendar(userId) {
    return await availabilityService.getAvailability(userId);
  }

  // Khóa một ngày bận (không nhận lịch đặt)
  async blockDate(userId, dateData) {
    return await scheduleRepository.create({
      mc: userId,
      ...dateData,
      status: "Busy",
    });
  }

  // Lấy thông tin ví và lịch sử giao dịch tiền tệ
  async getWallet(userId) {
    const history = await transactionRepository.findByUserId(userId);
    const stats = await transactionRepository.getStats(userId);
    return { history, stats };
  }

  // Yêu cầu rút tiền từ tài khoản hệ thống về tài khoản ngân hàng
  async requestPayout(userId, amount) {
    throw new Error(
      "Payout flow is deprecated in transaction service. Use booking-based refund/final-payment flows instead.",
    );
  }
}

module.exports = new MCService();
