const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    readStatus: { type: Boolean, default: false },
    attachments: [{
        url: String,
        fileType: { type: String, enum: ['image', 'script', 'document'] }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
