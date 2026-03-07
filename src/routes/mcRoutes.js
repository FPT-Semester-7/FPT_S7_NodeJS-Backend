const express = require('express');
const mcController = require('../controllers/mcController');
const router = express.Router();

router.get('/dashboard', mcController.getDashboard);
router.put('/profile', mcController.updateProfile);
router.get('/calendar', mcController.getCalendar);
router.post('/calendar/blockout', mcController.blockDate);
router.get('/wallet', mcController.getWallet);
router.post('/payout', mcController.requestPayout);

module.exports = router;
