const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const newBooking = await Booking.create(req.body);
        res.status(201).json({ status: 'success', data: { booking: newBooking } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('mc', 'name avatar')
            .populate('client', 'name avatar');

        if (!booking) return res.status(404).json({ status: 'fail', message: 'Booking not found' });

        res.status(200).json({ status: 'success', data: { booking } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;

        // Additional validation logic here depending on user role
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, paymentStatus },
            { new: true, runValidators: true }
        );

        if (!booking) return res.status(404).json({ status: 'fail', message: 'Booking not found' });

        res.status(200).json({ status: 'success', data: { booking } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const { userId, role } = req.query; // in real app get from req.user

        let query = {};
        if (role === 'mc') query.mc = userId;
        else if (role === 'client') query.client = userId;

        const bookings = await Booking.find(query).populate('mc', 'name').populate('client', 'name');
        res.status(200).json({ status: 'success', results: bookings.length, data: { bookings } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
