const express = require("express");
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

router.put("/settings", protect, authController.updateSettings);
router.post("/kyc", protect, authController.submitKYC);

module.exports = router;
