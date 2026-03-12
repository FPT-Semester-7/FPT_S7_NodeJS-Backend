/**
 * @file BookingRepository.js
 * @description Lớp truy xuất dữ liệu (Repository) cho quản lý đơn đặt lịch (Booking).
 */

const Booking = require('../models/Booking');

class BookingRepository {
    // Tạo đơn đặt lịch mới
    async create(bookingData) {
        return await Booking.create(bookingData);
    }

    // Lấy danh sách Booking dựa trên ID người dùng và vai trò (MC hay Client)
    async findByUserId(userId, role) {
        const query = role === 'mc' ? { mc: userId } : { client: userId };
        return await Booking.find(query).populate('mc client');
    }

    // Lấy chi tiết một bản ghi Booking qua ID
    async findById(id) {
        return await Booking.findById(id).populate('mc client');
    }

    // Cập nhật trạng thái của đơn đặt lịch (VD: Chấp nhận, Hoàn thành, Hủy)
    async updateStatus(id, status) {
        return await Booking.findByIdAndUpdate(id, { status }, { new: true });
    }

    // Đếm số lượng đơn đặt lịch đang ở trạng thái 'Confirmed' của người dùng
    async countActiveByUserId(userId, role) {
        const query = role === 'mc' ? { mc: userId, status: 'Confirmed' } : { client: userId, status: 'Confirmed' };
        return await Booking.countDocuments(query);
    }
}

module.exports = new BookingRepository();

