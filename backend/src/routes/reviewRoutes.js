const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.post('/', reviewController.createReview);
router.get('/mc/:mcId', reviewController.getMCReviews);
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview); // typically admin only

module.exports = router;
