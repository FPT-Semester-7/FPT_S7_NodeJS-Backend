const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true }, // MCHUD2026
    description: { type: String },
    discountType: {
        type: String,
        enum: ['Percentage', 'FixedAmount'], // Giảm theo % hay trừ thẳng tiền
        required: true
    },
    discountValue: { type: Number, required: true }, // Ví dụ: 10 (%) hoặc 500000 (VND)
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxUsage: { type: Number, default: 100 }, // Tổng số lần dùng
    usedCount: { type: Number, default: 0 }, // Đã dùng mấy lần
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Promo', promoSchema);
