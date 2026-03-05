const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mc: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: ['Deposit', 'FinalPayment', 'Refund'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    platformFee: { type: Number, default: 0 },
    transactionId: { type: String } // from VNPAY, Momo, Stripe...
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
