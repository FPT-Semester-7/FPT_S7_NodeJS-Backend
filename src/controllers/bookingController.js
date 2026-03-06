const bookingService = require('../services/BookingService');
const BookingDTO = require('../dtos/BookingDTO');

exports.createBooking = async (req, res) => {
    try {
        const sanitizedData = BookingDTO.fromRequest(req.body);
        const bookingData = { ...sanitizedData, client: req.user.id };
        const booking = await bookingService.createBooking(bookingData);
        res.status(201).json({ status: 'success', data: { booking: new BookingDTO(booking) } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getMyBookings(req.user.id, req.user.role);
        const formattedBookings = bookings.map(b => new BookingDTO(b));
        res.status(200).json({ 
            status: 'success', 
            results: formattedBookings.length, 
            data: { bookings: formattedBookings } 
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.payEscrow = async (req, res) => {
    try {
        const booking = await bookingService.processEscrowPayment(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: { booking: new BookingDTO(booking) } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
