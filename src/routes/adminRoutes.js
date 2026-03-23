const express = require("express");
const adminController = require("../controllers/adminController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUserStatus);
router.patch("/users/:id/profile", adminController.updateUserProfile);

router.get("/bookings", adminController.getAllBookings);
router.get("/transactions", adminController.getAllTransactions);

module.exports = router;
