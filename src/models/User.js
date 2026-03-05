const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ['client', 'mc', 'admin'],
            default: 'client',
        },
        phoneNumber: {
            type: String,
        },
        avatar: {
            type: String,
            default: 'default-avatar.png',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Only populated if role === 'mc'
        mcProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MCProfile',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
