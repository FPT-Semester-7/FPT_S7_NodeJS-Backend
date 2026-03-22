/**
 * @file index.js
 * @description Tệp tin chính (Entry Point) của dự án Backend Booking MC.
 * Thiết lập server Express, kết nối Database, cấu hình Socket.io và khai báo các Route.
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Nạp các biến môi trường từ file .env
dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Khởi tạo Socket.io để xử lý Chat thời gian thực
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store io instance on app for use in controllers
app.set("io", io);

// --- Cấu hình Middleware ---
app.use(express.json()); // Cho phép server đọc dữ liệu định dạng JSON từ Request Body

// --- Khai báo các Routes (Đường dẫn API) ---
const authRoutes = require("./routes/authRoutes");
const mcRoutes = require("./routes/mcRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const publicRoutes = require("./routes/publicRoutes");
const scriptRoutes = require("./routes/scriptRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

// --- Cài đặt các API Endpoints (Phiên bản v1) ---
app.use("/api/v1/auth", authRoutes); // Xác thực và thông tin cá nhân
app.use("/api/v1/mcs", mcRoutes); // Các chức năng dành riêng cho MC
app.use("/api/v1/bookings", bookingRoutes); // Quản lý đặt lịch (Booking)
app.use("/api/v1/admin", adminRoutes); // Chức năng quản trị viên
app.use("/api/v1/reviews", reviewRoutes); // Đánh giá và phản hồi
app.use("/api/v1/payments", paymentRoutes); // Quản lý giao dịch và thanh toán
app.use("/api/v1/public", publicRoutes); // Dữ liệu công khai cho trang chủ/tìm kiếm
app.use("/api/v1/scripts", scriptRoutes); // Quản lý thư viện kịch bản
app.use("/api/v1/availability", availabilityRoutes); // Lịch rảnh/bận của MC
app.use("/api/v1/notifications", notificationRoutes); // Thông báo
app.use("/api/v1/conversations", conversationRoutes); // Chat / Tin nhắn

/**
 * @function connectDB
 * @description Hàm kết nối tới cơ sở dữ liệu MongoDB.
 */
const connectDB = async () => {
  try {
    const defaultUri = "mongodb://localhost:27017/booking-mc";
    // Ưu tiên lấy URI từ môi trường, nếu không có sẽ dùng mặc định local
    await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGO_URI || defaultUri,
    );
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
app.get("/", (req, res) => {
  res.send("Welcome to Booking MC API (Web & React Native)");
});

/**
 * Track online users: userId -> Set of socket IDs
 */
const onlineUsers = new Map();

/**
 * Cấu hình sự kiện Socket.io
 * Xử lý xác thực, kết nối phòng chat, gửi tin nhắn và thông báo.
 */
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Authenticate and join user's room for notifications
  const token = socket.handshake.auth?.token;
  let userId = null;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret-fallback",
      );
      userId = decoded.id;
      socket.userId = userId;

      // Join user's personal notification room
      socket.join(`user_${userId}`);

      // Track online status
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      // Broadcast online status
      io.emit("user_online", { userId });

      console.log(`User ${userId} authenticated (socket: ${socket.id})`);
    } catch (err) {
      console.log(`Invalid token for socket ${socket.id}`);
    }
  }

  // Join a conversation room
  socket.on("join_conversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`Socket ${socket.id} joined conversation: ${conversationId}`);
  });

  // Leave a conversation room
  socket.on("leave_conversation", (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
  });

  // Handle send_message (real-time relay — actual persistence is in the REST API)
  socket.on("send_message", (data) => {
    // data: { conversationId, message }
    if (data.conversationId) {
      socket
        .to(`conversation_${data.conversationId}`)
        .emit("new_message", data.message);
    }
  });

  // Typing indicators
  socket.on("typing", (data) => {
    // data: { conversationId, userId, name }
    if (data.conversationId) {
      socket
        .to(`conversation_${data.conversationId}`)
        .emit("user_typing", data);
    }
  });

  socket.on("stop_typing", (data) => {
    if (data.conversationId) {
      socket
        .to(`conversation_${data.conversationId}`)
        .emit("user_stop_typing", data);
    }
  });

  // Get online status of specific users
  socket.on("check_online", (userIds) => {
    const result = {};
    for (const id of userIds) {
      result[id] = onlineUsers.has(id) && onlineUsers.get(id).size > 0;
    }
    socket.emit("online_status", result);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);

    if (userId) {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          io.emit("user_offline", { userId });
        }
      }
    }
  });
});

// --- Khởi động Server ---
const PORT = process.env.PORT || 5000;

// Chỉ chạy listener nếu không phải trong môi trường Test
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app và server để phục vụ mục đích kiểm thử (Testing)
module.exports = { app, server, io };
