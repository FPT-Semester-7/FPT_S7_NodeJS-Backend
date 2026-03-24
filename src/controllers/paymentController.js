/**
 * @file paymentController.js
 * @description Controller quản lý thanh toán: tạo link PayOS, xử lý webhook, tra cứu lịch sử.
 */

const Transaction = require("../models/Transaction");
const Booking = require("../models/Booking");
const payosService = require("../services/PayOSService");
const notificationService = require("../services/NotificationService");

/**
 * POST /api/v1/payments/create-link
 * Client tạo link thanh toán PayOS cho một booking đã được Accept.
 */
exports.createPaymentLink = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        status: "fail",
        message: "bookingId is required",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found",
      });
    }

    // Chỉ cho thanh toán booking đã được MC accept
    if (booking.status !== "Accepted") {
      return res.status(400).json({
        status: "fail",
        message: "Booking must be Accepted before payment",
      });
    }

    // Không cho thanh toán lại nếu đã paid
    if (["Paid", "DepositPaid", "FullyPaid"].includes(booking.paymentStatus)) {
      return res.status(400).json({
        status: "fail",
        message: "Booking has already been paid",
      });
    }

    // Tạo link thanh toán PayOS
    const { checkoutUrl, paymentLinkId, orderCode } =
      await payosService.createPaymentLink(booking);

    // Tạo Transaction ở trạng thái Pending
    await Transaction.create({
      booking: booking._id,
      client: booking.client,
      mc: booking.mc,
      amount: booking.price,
      type: "Deposit",
      status: "Pending",
      payosOrderCode: orderCode,
      payosPaymentLinkId: paymentLinkId,
    });

    res.status(200).json({
      status: "success",
      data: {
        checkoutUrl,
        paymentLinkId,
        orderCode,
      },
    });
  } catch (err) {
    console.error("PayOS createPaymentLink error:", err.message);
    res.status(500).json({ status: "fail", message: err.message });
  }
};

/**
 * POST /api/v1/payments/webhook/payos
 * Endpoint nhận webhook từ PayOS khi thanh toán thành công/thất bại.
 * KHÔNG cần JWT — xác thực bằng chữ ký HMAC từ PayOS.
 */
exports.handlePayOSWebhook = async (req, res) => {
  try {
    // Verify webhook bằng signature
    const webhookData = await payosService.verifyWebhook(req.body);

    if (!webhookData) {
      return res.status(400).json({ message: "Invalid webhook data" });
    }

    const { orderCode } = webhookData;

    // Tìm transaction theo orderCode
    const transaction = await Transaction.findOne({ payosOrderCode: orderCode });
    if (!transaction) {
      console.log(`Webhook: No transaction found for orderCode ${orderCode}`);
      return res.status(200).json({ message: "OK" }); // Trả 200 để PayOS không retry
    }

    // Kiểm tra code thành công
    const isSuccess =
      req.body.code === "00" || req.body.success === true;

    if (isSuccess && transaction.status !== "Completed") {
      // Cập nhật Transaction
      transaction.status = "Completed";
      transaction.paidAt = new Date();
      transaction.transactionId = webhookData.reference || webhookData.paymentLinkId;
      await transaction.save();

      // Cập nhật Booking paymentStatus
      await Booking.findByIdAndUpdate(transaction.booking, {
        paymentStatus: "Paid",
      });

      // Notify MC
      const io = req.app.get("io");
      await notificationService.create(
        {
          user: transaction.mc,
          senderId: transaction.client,
          title: "Payment Received",
          body: `Payment of ${transaction.amount?.toLocaleString()} VND has been confirmed.`,
          type: "payment_escrowed",
          relatedId: transaction.booking,
          relatedModel: "Booking",
          linkAction: `/m/wallet`,
        },
        io,
      );

      console.log(`✅ Payment confirmed for orderCode ${orderCode}`);
    } else if (!isSuccess) {
      // Thanh toán thất bại
      transaction.status = "Failed";
      await transaction.save();
      console.log(`❌ Payment failed for orderCode ${orderCode}`);
    }

    // Luôn trả 200 để PayOS không gửi lại webhook
    res.status(200).json({ message: "OK" });
  } catch (err) {
    console.error("PayOS webhook error:", err.message);
    res.status(200).json({ message: "OK" }); // Vẫn trả 200 để tránh retry vô hạn
  }
};

/**
 * GET /api/v1/payments/history
 * Lấy lịch sử giao dịch của user đang đăng nhập.
 */
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({
      $or: [{ client: userId }, { mc: userId }],
    })
      .populate("booking", "eventName eventDate eventType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: { transactions },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

/**
 * GET /api/v1/payments/status/:orderCode
 * Tra cứu trạng thái thanh toán từ PayOS theo orderCode.
 */
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const result = await payosService.getPaymentStatus(orderCode);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

/**
 * POST /api/v1/payments/demo-pay/:bookingId
 * Dành rành cho Demo, click và tự update mà không cần gọi API thật.
 */
exports.demoPay = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const transaction = await Transaction.findOne({ booking: bookingId, status: "Pending" });
    if (transaction) {
      transaction.status = "Completed";
      transaction.paidAt = new Date();
      transaction.transactionId = "DEMO-PAY";
      await transaction.save();
    }
    
    const booking = await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "Paid",
    });

    if (booking) {
      const io = req.app.get("io");
      await notificationService.create(
        {
          user: booking.mc,
          senderId: req.user.id,
          title: "Payment Received",
          body: `Payment of ${booking.price?.toLocaleString()} VND has been confirmed (Demo).`,
          type: "payment_escrowed",
          relatedId: booking._id,
          relatedModel: "Booking",
          linkAction: `/m/wallet`,
        },
        io,
      );
    }
    
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
