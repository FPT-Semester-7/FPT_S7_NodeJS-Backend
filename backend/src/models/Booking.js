const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mc: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true },
    eventType: { type: String, required: true },
    specialRequests: { type: String },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Completed', 'Cancelled', 'Rejected'],
        default: 'Pending',
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'DepositPaid', 'FullyPaid', 'Refunded'],
        default: 'Pending',
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
