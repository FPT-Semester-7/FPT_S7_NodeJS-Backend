const express = require("express");
const conversationController = require("../controllers/conversationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All conversation routes require authentication
router.use(protect);

// NOTE: No POST "/" — conversations are ONLY auto-created when a booking is created
router.get("/", conversationController.getConversations);
router.get("/:id", conversationController.getConversation);
router.get("/:id/messages", conversationController.getMessages);
router.post("/:id/messages", conversationController.sendMessage);
router.patch("/:id/read", conversationController.markAsRead);

module.exports = router;
