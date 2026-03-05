const User = require('../models/User');
const Booking = require('../models/Booking');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ status: 'success', results: users.length, data: { users } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { isActive, isVerified } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { isActive, isVerified }, { new: true });

        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('mc').populate('client');
        res.status(200).json({ status: 'success', results: bookings.length, data: { bookings } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
