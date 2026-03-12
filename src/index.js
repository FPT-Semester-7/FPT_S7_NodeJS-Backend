/**
 * @file index.js
 * @description Tệp tin chính (Entry Point) của dự án Backend Booking MC.
 * Thiết lập server Express, kết nối Database, cấu hình Socket.io và khai báo các Route.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

// Nạp các biến môi trường từ file .env
dotenv.config();

const app = express();
const server = http.createServer(app);

// Khởi tạo Socket.io để xử lý Chat thời gian thực
const io = new Server(server, {
    cors: {
        origin: '*', // Cho phép tất cả các nguồn truy cập (Cần siết lại khi Production)
        methods: ['GET', 'POST']
    }
});

// --- Cấu hình Middleware ---
app.use(cors()); // Cho phép chia sẻ tài nguyên giữa các domain khác nhau
app.use(express.json()); // Cho phép server đọc dữ liệu định dạng JSON từ Request Body

// --- Khai báo các Routes (Đường dẫn API) ---
const authRoutes = require('./routes/authRoutes');
const mcRoutes = require('./routes/mcRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const publicRoutes = require('./routes/publicRoutes');
const scriptRoutes = require('./routes/scriptRoutes');

// --- Cài đặt các API Endpoints (Phiên bản v1) ---
app.use('/api/v1/auth', authRoutes);      // Xác thực và thông tin cá nhân
app.use('/api/v1/mcs', mcRoutes);         // Các chức năng dành riêng cho MC
app.use('/api/v1/bookings', bookingRoutes); // Quản lý đặt lịch (Booking)
app.use('/api/v1/admin', adminRoutes);    // Chức năng quản trị viên
app.use('/api/v1/reviews', reviewRoutes);  // Đánh giá và phản hồi
app.use('/api/v1/payments', paymentRoutes); // Quản lý giao dịch và thanh toán
app.use('/api/v1/public', publicRoutes);   // Dữ liệu công khai cho trang chủ/tìm kiếm
app.use('/api/v1/scripts', scriptRoutes);   // Quản lý thư viện kịch bản

/**
 * @function connectDB
 * @description Hàm kết nối tới cơ sở dữ liệu MongoDB.
 */
const connectDB = async () => {
    try {
        const defaultUri = 'mongodb://localhost:27017/booking-mc';
        // Ưu tiên lấy URI từ môi trường, nếu không có sẽ dùng mặc định local
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || defaultUri);
        console.log(`MongoDB Connected successfully!`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
    }
};

// Thực hiện kết nối Database
connectDB();

/**
 * Endpoint mặc định để kiểm tra trạng thái server
 */
app.get('/', (req, res) => {
    res.send('Welcome to Booking MC API (Web & React Native)');
});

/**
 * Cấu hình sự kiện Socket.io cho Chat
 * Xử lý kết nối, tham gia phòng chat và gửi tin nhắn.
 */
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Tham gia vào phòng chat dựa trên Booking ID
    socket.on('join_chat', (bookingId) => {
        socket.join(bookingId);
        console.log(`User joined chat room: ${bookingId}`);
    });

    // Xử lý gửi tin nhắn tới các thành viên trong phòng
    socket.on('send_message', (data) => {
        // data dự kiến chứa: { bookingId, senderId, receiverId, content, attachments }
        // TODO: Lưu vào Database thông qua Message model trước khi gửi đi
        io.to(data.bookingId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// --- Khởi động Server ---
const PORT = process.env.PORT || 5000;

// Chỉ chạy listener nếu không phải trong môi trường Test
if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export app và server để phục vụ mục đích kiểm thử (Testing)
module.exports = { app, server, io };

