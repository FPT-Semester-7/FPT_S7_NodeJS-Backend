const express = require('express');
const mcController = require('../controllers/mcController');
// const { protect, restrictTo } = require('../middlewares/authMiddleware'); // Uncomment when middleware is ready

const router = express.Router();

router.get('/', mcController.getAllMCs);
router.get('/:id', mcController.getMCDetails);

// Protect routes below this line
// router.use(protect);
// router.put('/profile', restrictTo('mc'), mcController.updateProfile);

module.exports = router;
