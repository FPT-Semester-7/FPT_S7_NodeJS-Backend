const express = require("express");
const bookingController = require("../controllers/bookingController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(protect);

router.post(
  "/",
  restrictTo("client", "admin"),
  bookingController.createBooking,
);
router.get("/my-bookings", bookingController.getMyBookings);
router.get(
  "/client",
  restrictTo("client", "admin"),
  bookingController.getClientBookings,
);
router.get("/mc", restrictTo("mc", "admin"), bookingController.getMCBookings);
router.put(
  "/:id/accept",
  restrictTo("mc", "admin"),
  bookingController.acceptBooking,
);
router.put(
  "/:id/reject",
  restrictTo("mc", "admin"),
  bookingController.rejectBooking,
);
router.post(
  "/pay/:id",
  restrictTo("client", "admin"),
  bookingController.payEscrow,
);

module.exports = router;
