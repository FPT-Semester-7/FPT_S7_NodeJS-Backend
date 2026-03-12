/**
 * @file MCService.js
 * @description Lớp nghiệp vụ (Service) xử lý các chức năng dành riêng cho MC (Dashboard, Profile, Lịch làm việc, Ví tiền).
 */

const mcProfileRepository = require("../repositories/MCProfileRepository");
const bookingRepository = require("../repositories/BookingRepository");
const transactionRepository = require("../repositories/TransactionRepository");
const scheduleRepository = require("../repositories/ScheduleRepository");
const availabilityService = require("./AvailabilityService");

class MCService {
  // Lấy số liệu thống kê tổng quan cho trang Dashboard của MC
  async getDashboardStats(userId) {
    const profile = await mcProfileRepository.findByUserId(userId);
    const totalBookings = await bookingRepository.countActiveByUserId(
      userId,
      "mc",
    );
    const walletStats = await transactionRepository.getStats(userId);

    return {
      profileStatus: profile ? profile.status : "Unavailable",
      completionPercentage: 85, // Giả lập tỉ lệ hoàn thiện profile
      stats: {
        totalBookings,
        activeInquiries: 3,
        profileViews: 1240,
        revenue: walletStats.totalRevenue,
      },
      isVerified: true,
    };
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
    return await transactionRepository.create({
      user: userId,
      amount,
      type: "Debit",
      status: "Pending",
      description: "Payout Request",
    });
  }
}

module.exports = new MCService();
