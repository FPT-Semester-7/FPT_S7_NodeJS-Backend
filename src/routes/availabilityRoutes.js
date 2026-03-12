const express = require("express");
const availabilityController = require("../controllers/availabilityController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:mcId", availabilityController.getAvailability);
router.post(
  "/",
  protect,
  restrictTo("mc", "admin"),
  availabilityController.createAvailability,
);
router.delete(
  "/:id",
  protect,
  restrictTo("mc", "admin"),
  availabilityController.deleteAvailability,
);

module.exports = router;
