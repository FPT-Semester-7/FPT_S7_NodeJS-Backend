/**
 * @file db.js
 * @description Cấu hình kết nối MongoDB sử dụng thư viện Mongoose.
 */

const mongoose = require('mongoose');

/**
 * @function connectDB
 * @description Thiết lập kết nối cơ sở dữ liệu.
 * @throws Thoát chương trình nếu kết nối thất bại.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/booking-mc', {
            useNewUrlParser: true, // Sử dụng bộ phân tích cú pháp URL mới
            useUnifiedTopology: true, // Sử dụng công cụ quản lý kết nối mới
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1); // Dừng server nếu không thể kết nối Database
    }
};

module.exports = connectDB;

