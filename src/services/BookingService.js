const bookingRepository = require('../repositories/BookingRepository');
const transactionRepository = require('../repositories/TransactionRepository');

class BookingService {
    async createBooking(bookingData) {
        // Business logic: check availability first (omitted for brevity)
        const booking = await bookingRepository.create(bookingData);
        return booking;
    }

    async processEscrowPayment(bookingId, paymentDetails) {
        const booking = await bookingRepository.findById(bookingId);
        if (!booking) throw new Error('Booking not found');

        // Logic to interact with payment gateway (mocked)
        await transactionRepository.create({
            user: booking.client,
            amount: booking.totalPrice,
            type: 'Debit',
            status: 'Completed',
            description: `Escrow Payment for Booking #${bookingId}`
        });

        return await bookingRepository.updateStatus(bookingId, 'Confirmed');
    }

    async getMyBookings(userId, role) {
        return await bookingRepository.findByUserId(userId, role);
    }
}

module.exports = new BookingService();
