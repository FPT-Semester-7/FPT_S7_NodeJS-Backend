/**
 * @file BookingRepository.js
 * @description Lớp truy xuất dữ liệu (Repository) cho quản lý đơn đặt lịch (Booking).
 */

const Booking = require("../models/Booking");

class BookingRepository {
  // Tạo đơn đặt lịch mới
  async create(bookingData) {
    const booking = await Booking.create(bookingData);
    return this.findById(booking._id);
  }

  // Lấy danh sách Booking dựa trên ID người dùng và vai trò (MC hay Client)
  async findByUserId(userId, role) {
    const query = role === "mc" ? { mc: userId } : { client: userId };
    return await Booking.find(query)
      .populate("mc client")
      .sort({ eventDate: 1, createdAt: -1 });
  }

  async findByClientId(clientId) {
    return await Booking.find({ client: clientId })
      .populate("mc client")
      .sort({ createdAt: -1 });
  }

  async findByMCId(mcId) {
    return await Booking.find({ mc: mcId })
      .populate("mc client")
      .sort({ eventDate: 1, createdAt: -1 });
  }

  async findCalendarByMCId(mcId) {
    return await Booking.find({
      mc: mcId,
      status: { $in: ["Pending", "Accepted"] },
    })
      .populate("mc client")
      .sort({ eventDate: 1, createdAt: -1 });
  }

  // Lấy chi tiết một bản ghi Booking qua ID
  async findById(id) {
    return await Booking.findById(id).populate("mc client");
  }

  // Cập nhật trạng thái của đơn đặt lịch (VD: Chấp nhận, Hoàn thành, Hủy)
  async updateStatus(id, status, extraData = {}) {
    return await Booking.findByIdAndUpdate(
      id,
      { status, ...extraData },
      { new: true },
    ).populate("mc client");
  }

  // Đếm số lượng đơn đặt lịch đang ở trạng thái 'Confirmed' của người dùng
  async countActiveByUserId(userId, role) {
    const query =
      role === "mc"
        ? { mc: userId, status: "Accepted" }
        : { client: userId, status: "Accepted" };
    return await Booking.countDocuments(query);
  }
}

module.exports = new BookingRepository();
