const express = require("express");
const mcController = require("../controllers/mcController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(protect, restrictTo("mc", "admin"));

router.get("/dashboard", mcController.getDashboard);
router.put("/profile", mcController.updateProfile);
router.get("/calendar", mcController.getCalendar);
router.post("/calendar/blockout", mcController.blockDate);
router.get("/wallet", mcController.getWallet);
router.post("/payout", mcController.requestPayout);

module.exports = router;
