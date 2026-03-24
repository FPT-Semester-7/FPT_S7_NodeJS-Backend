const express = require("express");
const paymentController = require("../controllers/paymentController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(["client", "mc", "admin"]),
  paymentController.createPayment,
);
router.get(
  "/history/:userId",
  authenticate,
  authorize(["client", "mc", "admin"]),
  paymentController.getPaymentHistory,
);
router.patch(
  "/:id",
  authenticate,
  authorize(["client", "mc", "admin"]),
  paymentController.updatePaymentStatus,
); // Typically admin or webhook

module.exports = router;
