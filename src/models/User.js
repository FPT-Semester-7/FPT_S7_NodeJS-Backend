/**
 * @file User.js
 * @description Schema định nghĩa thông tin người dùng trong hệ thống (Client, MC, Admin).
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        // Tên hiển thị của người dùng
        name: {
            type: String,
            required: [true, 'Vui lòng cung cấp tên'],
            trim: true,
        },
        // Địa chỉ email (Dùng làm tên đăng nhập, phải là duy nhất)
        email: {
            type: String,
            required: [true, 'Vui lòng cung cấp email'],
            unique: true,
            lowercase: true,
        },
        // Mật khẩu (Min 6 ký tự, mặc định không hiển thị khi query)
        password: {
            type: String,
            required: [true, 'Vui lòng cung cấp mật khẩu'],
            minlength: 6,
            select: false, 
        },
        // Vai trò người dùng trong hệ thống
        role: {
            type: String,
            enum: ['client', 'mc', 'admin'],
            default: 'client',
        },
        // Số điện thoại liên lạc
        phoneNumber: {
            type: String,
        },
        // Đường dẫn ảnh đại diện
        avatar: {
            type: String,
            default: 'default-avatar.png',
        },
        // Trạng thái xác thực email/tài khoản
        isVerified: {
            type: Boolean,
            default: false,
        },
        // Trạng thái hoạt động của tài khoản
        isActive: {
            type: Boolean,
            default: true,
        },
        // Liên kết tới hồ sơ chi tiết nếu là MC (role === 'mc')
        mcProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MCProfile',
        },
    },
    { timestamps: true } // Tự động tạo createdAt và updatedAt
);

module.exports = mongoose.model('User', userSchema);

