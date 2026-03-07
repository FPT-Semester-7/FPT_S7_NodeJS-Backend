const Booking = require('../models/Booking');

class BookingRepository {
    async create(bookingData) {
        return await Booking.create(bookingData);
    }

    async findByUserId(userId, role) {
        const query = role === 'mc' ? { mc: userId } : { client: userId };
        return await Booking.find(query).populate('mc client');
    }

    async findById(id) {
        return await Booking.findById(id).populate('mc client');
    }

    async updateStatus(id, status) {
        return await Booking.findByIdAndUpdate(id, { status }, { new: true });
    }

    async countActiveByUserId(userId, role) {
        const query = role === 'mc' ? { mc: userId, status: 'Confirmed' } : { client: userId, status: 'Confirmed' };
        return await Booking.countDocuments(query);
    }
}

module.exports = new BookingRepository();
