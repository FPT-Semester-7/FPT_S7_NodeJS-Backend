const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (Assuming some protect middleware exists in index or common)
// router.use(protect); 
router.put('/settings', authController.updateSettings);
router.post('/kyc', authController.submitKYC);

module.exports = router;
