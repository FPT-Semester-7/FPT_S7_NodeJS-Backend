const express = require("express");
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// PayOS webhook: xác thực bằng chữ ký HMAC, KHÔNG dùng JWT.
router.post("/webhook/payos", paymentController.handlePayOSWebhook);

// Các route cần đăng nhập
router.post("/create-link", protect, paymentController.createPaymentLink);
router.get("/history", protect, paymentController.getPaymentHistory);
router.get("/status/:orderCode", protect, paymentController.checkPaymentStatus);

module.exports = router;
