const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/', paymentController.createPayment);
router.get('/history/:userId', paymentController.getPaymentHistory);
router.patch('/:id', paymentController.updatePaymentStatus); // Typically admin or webhook

module.exports = router;
