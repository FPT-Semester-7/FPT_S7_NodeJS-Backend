const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.post('/pay/:id', bookingController.payEscrow);

module.exports = router;
