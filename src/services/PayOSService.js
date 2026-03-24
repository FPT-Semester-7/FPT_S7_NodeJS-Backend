/**
 * @file PayOSService.js
 * @description Service tích hợp cổng thanh toán PayOS.
 * Tạo link thanh toán QR, xác thực webhook và tra cứu trạng thái.
 */

const { PayOS } = require("@payos/node");

let _instance = null;

/** Lazy init: đảm bảo dotenv đã load xong trước khi đọc env */
function getClient() {
  if (!_instance) {
    _instance = new PayOS({
      clientId: process.env.PAYOS_CLIENT_ID,
      apiKey: process.env.PAYOS_API_KEY,
      checksumKey: process.env.PAYOS_CHECKSUM_KEY,
    });
  }
  return _instance;
}

class PayOSService {
  /**
   * Tạo link thanh toán PayOS cho một booking.
   * @param {Object} booking - Document booking từ DB (đã populate client).
   * @returns {{ checkoutUrl, paymentLinkId, orderCode }}
   */
  async createPaymentLink(booking) {
    const payos = getClient();

    // orderCode phải là số nguyên dương, dùng timestamp + random để tránh trùng
    const orderCode = Number(
      `${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100)}`,
    );

    const FE_URL = process.env.FE_URL || "http://localhost:5173";

    const paymentData = {
      orderCode,
      amount: Math.round(booking.price), // PayOS yêu cầu số nguyên (VND)
      description: `MCHub ${booking.eventName || booking.eventType || "Booking"}`.slice(0, 25),
      returnUrl: `${FE_URL}/payment/success?bookingId=${booking._id}`,
      cancelUrl: `${FE_URL}/payment/cancel?bookingId=${booking._id}`,
    };

    const paymentLink = await payos.paymentRequests.create(paymentData);

    return {
      checkoutUrl: paymentLink.checkoutUrl,
      paymentLinkId: paymentLink.paymentLinkId || paymentLink.id,
      orderCode,
    };
  }

  /**
   * Xác thực dữ liệu webhook từ PayOS bằng chữ ký HMAC.
   * @param {Object} webhookBody - Toàn bộ req.body từ PayOS gửi tới.
   * @returns {Object} Dữ liệu đã được xác thực.
   */
  async verifyWebhook(webhookBody) {
    const payos = getClient();
    const webhookData = await payos.webhooks.verify(webhookBody);
    return webhookData;
  }

  /**
   * Tra cứu trạng thái thanh toán theo orderCode.
   * @param {number|string} orderCode
   * @returns {Object} Thông tin payment request từ PayOS.
   */
  async getPaymentStatus(orderCode) {
    const payos = getClient();
    const result = await payos.paymentRequests.retrieve(String(orderCode));
    return result;
  }
}

module.exports = new PayOSService();
