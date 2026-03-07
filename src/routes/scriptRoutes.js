const express = require('express');
const scriptController = require('../controllers/scriptController');
const router = express.Router();

router.get('/', scriptController.getAllScripts);
router.get('/:id', scriptController.getScript);
router.post('/favorite/:id', scriptController.favoriteScript);
router.get('/:id/reader', scriptController.getReaderData);

module.exports = router;
