const Review = require('../models/Review');
const Booking = require('../models/Booking');
const MCProfile = require('../models/MCProfile');

exports.createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const clientId = req.user ? req.user._id : req.body.clientId; // Assume auth middleware

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ status: 'fail', message: 'Booking not found' });
        if (booking.status !== 'Completed') {
            return res.status(400).json({ status: 'fail', message: 'Can only review completed bookings' });
        }

        const review = await Review.create({
            booking: bookingId,
            mc: booking.mc,
            client: clientId,
            rating,
            comment
        });

        // Update MC Profile average rating
        const reviews = await Review.find({ mc: booking.mc });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await MCProfile.findOneAndUpdate(
            { user: booking.mc },
            { rating: avgRating, reviewsCount: reviews.length }
        );

        res.status(201).json({ status: 'success', data: { review } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMCReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ mc: req.params.mcId }).populate('client', 'name avatar');
        res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Update review within 24h
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ status: 'fail', message: 'Review not found' });

        // Check if within 24 hours
        const timeDiff = new Date() - new Date(review.createdAt);
        if (timeDiff > 24 * 60 * 60 * 1000) {
            return res.status(400).json({ status: 'fail', message: 'Review can only be edited within 24 hours' });
        }

        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({ status: 'success', data: { review: updatedReview } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Admin delete inappropriate review
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
