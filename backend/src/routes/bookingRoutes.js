const express = require('express');
const bookingController = require('../controllers/bookingController');
// const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingDetails);
router.patch('/:id', bookingController.updateBookingStatus);

module.exports = router;
