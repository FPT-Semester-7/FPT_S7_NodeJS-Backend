const express = require('express');
const publicController = require('../controllers/publicController');
const router = express.Router();

router.get('/landing', publicController.getLandingData);
router.get('/mcs', publicController.discoverMCs);
router.get('/mcs/:id', publicController.getMCProfile);
router.get('/resources', publicController.getResources);

module.exports = router;
