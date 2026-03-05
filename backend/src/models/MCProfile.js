const mongoose = require('mongoose');

const mcProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    regions: {
        type: [String],
        default: [],
    },
    experience: {
        type: Number,
        default: 0,
    },
    styles: {
        type: [String],
        default: [],
    },
    rates: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
    },
    eventTypes: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['Available', 'Busy'],
        default: 'Available',
    },
    showreels: [
        {
            url: { type: String, required: true },
            type: { type: String, enum: ['image', 'video'], required: true },
        }
    ],
    rating: {
        type: Number,
        default: 0,
    },
    reviewsCount: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('MCProfile', mcProfileSchema);
