const express = require("express");
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/mc/:mcId", reviewController.getMCReviews);
router.post("/", protect, reviewController.createReview);
router.patch("/:id", protect, reviewController.updateReview);
router.delete("/:id", protect, reviewController.deleteReview); // typically admin only

module.exports = router;
